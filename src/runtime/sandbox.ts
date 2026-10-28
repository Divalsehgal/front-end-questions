import type { TestResult } from './harness';

export type SandboxRequest = { kind: 'predict'; code: string; lang?: 'js' | 'ts' } | { kind: 'code'; solution: string; tests: string };

export type SandboxResponse = { kind: 'predict'; lines: string[] } | { kind: 'code'; results: TestResult[]; logs: string[]; fatal?: string };

export type { TestResult };

function run<T extends SandboxResponse>(req: SandboxRequest, timeoutMs: number): Promise<T | { kind: 'timeout' }> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./sandbox.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ kind: 'timeout' });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<T>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.postMessage(req);
  });
}

/** Runs a snippet and returns what it logged, one entry per console call. */
export async function runSnippet(code: string, lang: 'js' | 'ts' = 'js'): Promise<string[]> {
  const res = await run<Extract<SandboxResponse, { kind: 'predict' }>>({ kind: 'predict', code, lang }, 4000);
  return res.kind === 'timeout' ? ['⏱ Timed out (infinite loop?)'] : res.lines;
}

export async function runCodeTests(solution: string, tests: string) {
  const res = await run<Extract<SandboxResponse, { kind: 'code' }>>({ kind: 'code', solution, tests }, 20000);
  if (res.kind === 'timeout') return { results: [], logs: [], fatal: 'Timed out after 20s. Is there an infinite loop?' };
  return res;
}

// Expected output never changes, so run each snippet once per page load.
const snippetCache = new Map<string, Promise<string[]>>();
export function expectedOutput(code: string, lang: 'js' | 'ts' = 'js') {
  const key = `${lang}:${code}`;
  let pending = snippetCache.get(key);
  if (!pending) {
    pending = runSnippet(code, lang);
    snippetCache.set(key, pending);
  }
  return pending;
}
