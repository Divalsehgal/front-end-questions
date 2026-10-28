// sandbox.ts only talks to the Worker API, so a fake Worker is enough to test it in node.
// The real worker (sandbox.worker.ts) is exercised end to end by src/test/sandbox.ts + the content gate.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Reply = ((req: unknown) => unknown) | 'never';

class FakeWorker {
  static instances: FakeWorker[] = [];
  static reply: Reply = () => ({});
  onmessage: ((e: { data: unknown }) => void) | null = null;
  posted: unknown[] = [];
  terminated = false;
  constructor(
    public url: URL,
    public options: unknown,
  ) {
    FakeWorker.instances.push(this);
  }
  postMessage(req: unknown) {
    this.posted.push(req);
    const reply = FakeWorker.reply;
    if (reply !== 'never') queueMicrotask(() => this.onmessage?.({ data: reply(req) }));
  }
  terminate() {
    this.terminated = true;
  }
}

const load = () => import('./sandbox');

beforeEach(() => {
  vi.resetModules();
  FakeWorker.instances = [];
  FakeWorker.reply = () => ({});
  vi.stubGlobal('Worker', FakeWorker);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('runSnippet', () => {
  it('posts a predict request to a module worker and returns its lines', async () => {
    FakeWorker.reply = () => ({ kind: 'predict', lines: ['1', '2'] });
    const { runSnippet } = await load();
    expect(await runSnippet('console.log(1)', 'ts')).toEqual(['1', '2']);
    const [w] = FakeWorker.instances;
    expect(w.posted).toEqual([{ kind: 'predict', code: 'console.log(1)', lang: 'ts' }]);
    expect(w.options).toEqual({ type: 'module' });
    expect(String(w.url)).toMatch(/sandbox\.worker\.ts$/);
    expect(w.terminated).toBe(true);
  });

  it('defaults to js', async () => {
    FakeWorker.reply = () => ({ kind: 'predict', lines: [] });
    const { runSnippet } = await load();
    await runSnippet('x');
    expect(FakeWorker.instances[0].posted[0]).toMatchObject({ lang: 'js' });
  });

  it('kills a worker that never answers and reports a timeout', async () => {
    vi.useFakeTimers();
    FakeWorker.reply = 'never';
    const { runSnippet } = await load();
    const pending = runSnippet('while(true){}');
    await vi.advanceTimersByTimeAsync(4000);
    expect(await pending).toEqual(['⏱ Timed out (infinite loop?)']);
    expect(FakeWorker.instances[0].terminated).toBe(true);
  });

  it('clears the timeout when the worker answers', async () => {
    vi.useFakeTimers();
    FakeWorker.reply = () => ({ kind: 'predict', lines: ['ok'] });
    const { runSnippet } = await load();
    await runSnippet('1');
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('runCodeTests', () => {
  it('returns the worker result', async () => {
    const res = { kind: 'code', results: [{ name: 't', ok: true, ms: 1 }], logs: ['l'] };
    FakeWorker.reply = () => res;
    const { runCodeTests } = await load();
    expect(await runCodeTests('sol', 'tests')).toEqual(res);
    expect(FakeWorker.instances[0].posted).toEqual([{ kind: 'code', solution: 'sol', tests: 'tests' }]);
  });

  it('turns a hung run into a fatal error after 20s', async () => {
    vi.useFakeTimers();
    FakeWorker.reply = 'never';
    const { runCodeTests } = await load();
    const pending = runCodeTests('sol', 'tests');
    await vi.advanceTimersByTimeAsync(19_999);
    expect(FakeWorker.instances[0].terminated).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toEqual({ results: [], logs: [], fatal: 'Timed out after 20s. Is there an infinite loop?' });
  });
});

describe('expectedOutput', () => {
  it('runs each (lang, code) pair once per page load', async () => {
    let n = 0;
    FakeWorker.reply = () => ({ kind: 'predict', lines: [`run ${++n}`] });
    const { expectedOutput } = await load();
    const a = expectedOutput('x');
    expect(expectedOutput('x')).toBe(a);
    expect(await a).toEqual(['run 1']);
    expect(await expectedOutput('x', 'ts')).toEqual(['run 2']);
    expect(await expectedOutput('y')).toEqual(['run 3']);
    expect(FakeWorker.instances).toHaveLength(3);
  });
});
