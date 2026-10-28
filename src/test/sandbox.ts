// Node-side equivalent of src/runtime/sandbox.worker.ts for CI. Each drill runs in a fresh
// worker thread (like the browser's per-run Web Worker), so a drill that disables Promise.all,
// patches Array.prototype, or leaves promises rejecting unobserved can't affect anything else.
// Security: test-only code (never bundled into the app). It evaluates the repository's own question
// fixtures in CI, in a worker thread or a fresh node:vm context with a timeout; no external input.
import vm from 'node:vm';
import { Worker } from 'node:worker_threads';
import { transform } from 'sucrase';
import formatSource from '../runtime/format.ts?raw';
import harnessSource from '../runtime/harness.ts?raw';
import type * as FormatModule from '../runtime/format';
import type { TestResult } from '../runtime/harness';

const toCommonJs = (source: string) => transform(source, { transforms: ['typescript', 'imports'] }).code;
const FORMAT_JS = toCommonJs(formatSource);
const HARNESS_JS = toCommonJs(harnessSource);

// Plain JS evaluated inside the worker thread.
const WORKER = `
const { parentPort, workerData } = require('node:worker_threads');
process.on('unhandledRejection', () => {}); // unfinished starters may leave promises rejecting
for (const k of ['log', 'info', 'warn', 'error', 'debug']) console[k] = () => {};
const modules = {};
const req = (p) => { if (!(p in modules)) throw new Error('Cannot import "' + p + '" in the sandbox'); return modules[p]; };
const load = (name, code) => { const module = { exports: {} }; new Function('exports', 'require', 'module', code)(module.exports, req, module); return (modules[name] = module.exports); };
(async () => {
  const { format, harness, solution, tests } = workerData;
  load('./format', format);
  const h = load('./harness', harness);
  try { load('./solution', solution); } catch (e) { parentPort.postMessage({ results: [], fatal: 'solution failed to load: ' + e }); return; }
  const clock = h.createClock();
  const testsFn = new Function('exports', 'require', 'module', 'test', 'assert', 'fn', 'clock', tests);
  const results = await h.runTests(({ test }) => testsFn({}, req, { exports: {} }, test, h.assert, h.fn, clock), clock);
  parentPort.postMessage({ results });
})();
`;

/** Runs a drill's tests against `solution` in a fresh thread. Mirrors the browser worker. */
export function runDrill(solution: string, tests: string): Promise<{ results: TestResult[]; fatal?: string }> {
  let solutionJs: string;
  try {
    solutionJs = toCommonJs(solution);
  } catch (e) {
    return Promise.resolve({ results: [], fatal: `solution failed to compile: ${String(e)}` });
  }
  return new Promise((resolve) => {
    const worker = new Worker(WORKER, { eval: true, workerData: { format: FORMAT_JS, harness: HARNESS_JS, solution: solutionJs, tests: toCommonJs(tests) } });
    const timer = setTimeout(() => {
      void worker.terminate();
      resolve({ results: [], fatal: 'timed out after 25s' });
    }, 25_000);
    worker.once('message', (msg: { results: TestResult[]; fatal?: string }) => {
      clearTimeout(timer);
      void worker.terminate();
      resolve(msg);
    });
    worker.once('error', (err: Error) => {
      clearTimeout(timer);
      resolve({ results: [], fatal: String(err) });
    });
  });
}

/** Runs an output snippet in an isolated vm context and returns what it logged. */
export async function runSnippet(code: string, lang: 'js' | 'ts' = 'js'): Promise<string[]> {
  const lines: string[] = [];
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, structuredClone, console: {} });
  const module = { exports: {} as Record<string, unknown> };
  vm.runInContext(`(function (exports, require, module) {\n${FORMAT_JS}\n})`, ctx)(module.exports, () => ({}), module);
  const { formatArgs } = module.exports as typeof FormatModule;
  ctx.console = { log: (...args: unknown[]) => lines.push(formatArgs(args)) };
  const source = lang === 'ts' ? transform(code, { transforms: ['typescript'], disableESTransforms: true }).code : code;
  try {
    // A plain call of a strict-mode function, as in the worker: top-level `this` is undefined.
    vm.runInContext(`(function () {"use strict";\n${source}\n})`, ctx)();
  } catch (e) {
    lines.push(`Uncaught ${(e as Error).name}`);
  }
  await new Promise((r) => setTimeout(r, 60));
  return lines;
}
