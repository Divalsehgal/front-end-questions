/// <reference lib="webworker" />
// A fresh worker is created for every run, so user code can't leak globals,
// timers or monkey-patches into the next run, and an infinite loop can be killed.
import { transform } from 'sucrase';
import { formatArgs } from './format';
import { assert, createClock, fn, runTests } from './harness';
import type { SandboxRequest, SandboxResponse } from './sandbox';

const reply = (msg: SandboxResponse) => postMessage(msg);

function captureConsole(lines: string[]) {
  for (const level of ['log', 'info', 'warn', 'error'] as const) {
    // Redirects the user's console output into the result panel.
    // eslint-disable-next-line no-console
    console[level] = (...args: unknown[]) => {
      lines.push(formatArgs(args));
    };
  }
}

const errorLine = (e: unknown, inPromise = false) => {
  const prefix = inPromise ? 'Uncaught (in promise)' : 'Uncaught';
  return e instanceof Error ? `${prefix} ${e.name}: ${e.message}` : `${prefix} ${formatArgs([e])}`;
};

const toCommonJs = (source: string) => transform(source, { transforms: ['typescript', 'imports'] }).code;

async function runPredict(source: string, lang: 'js' | 'ts' = 'js') {
  const lines: string[] = [];
  captureConsole(lines);
  self.addEventListener('error', (ev) => {
    ev.preventDefault();
    lines.push(errorLine(ev.error));
  });
  self.addEventListener('unhandledrejection', (ev) => {
    ev.preventDefault();
    lines.push(errorLine(ev.reason, true));
  });
  let code = source;
  try {
    if (lang === 'ts') code = transform(source, { transforms: ['typescript'], disableESTransforms: true }).code;
    // A plain call with no receiver: top-level `this` is undefined, like an ES module.
    new Function(`"use strict";\n${code}`).call(undefined);
  } catch (e) {
    lines.push(errorLine(e));
  }
  // Let the snippet's microtasks and short timers finish.
  await new Promise((r) => setTimeout(r, 60));
  reply({ kind: 'predict', lines });
}

async function runCode(solution: string, tests: string) {
  const logs: string[] = [];
  captureConsole(logs);
  const clock = createClock();

  const solutionExports: Record<string, unknown> = {};
  try {
    new Function('exports', 'require', 'module', toCommonJs(solution))(solutionExports, () => ({}), { exports: solutionExports });
  } catch (e) {
    reply({ kind: 'code', results: [], logs, fatal: `Your code failed to load: ${errorLine(e).replace(/^Uncaught /, '')}` });
    return;
  }

  let testsJs: string;
  try {
    testsJs = toCommonJs(tests);
  } catch (e) {
    reply({ kind: 'code', results: [], logs, fatal: `Test file failed to compile: ${String(e)}` });
    return;
  }

  const require = (path: string) => {
    if (path === './solution') return solutionExports;
    throw new Error(`Cannot import "${path}" in the sandbox`);
  };

  try {
    const results = await runTests(({ test }) => {
      new Function('exports', 'require', 'module', 'test', 'assert', 'fn', 'clock', testsJs)({}, require, { exports: {} }, test, assert, fn, clock);
    }, clock);
    reply({ kind: 'code', results, logs });
  } catch (e) {
    reply({ kind: 'code', results: [], logs, fatal: errorLine(e).replace(/^Uncaught /, '') });
  }
}

self.onmessage = (e: MessageEvent<SandboxRequest>) => {
  const req = e.data;
  if (req.kind === 'predict') void runPredict(req.code, req.lang);
  else void runCode(req.solution, req.tests);
};
