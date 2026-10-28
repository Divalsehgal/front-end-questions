// checkTypes only uses a handful of Monaco APIs, so a hand-rolled fake covers it in node.
// The real TypeScript behaviour of type tests is covered by src/test/typecheck.ts + the content gate.
import { describe, expect, it, vi } from 'vitest';
import { checkTypes } from './typecheck';
import type { Monaco } from '../ui/CodeEditor';

type Diag = { start?: number; messageText: unknown };

function fakeMonaco(syntactic: Diag[], semantic: Diag[]) {
  let text = '';
  const model = {
    // Offsets in these tests are line numbers * 1000, which keeps the fake trivial.
    getPositionAt: (offset: number) => ({ lineNumber: Math.floor(offset / 1000) + 1 }),
    getLineContent: (line: number) => text.split('\n')[line - 1] ?? '',
    dispose: vi.fn(),
  };
  const worker = {
    getSyntacticDiagnostics: vi.fn(async () => syntactic),
    getSemanticDiagnostics: vi.fn(async () => semantic),
  };
  const getWorker = vi.fn(async (_uri: { toString(): string }) => worker);
  const monaco = {
    Uri: { parse: (s: string) => ({ toString: () => s }) },
    editor: {
      createModel: vi.fn((value: string) => {
        text = value;
        return model;
      }),
    },
    languages: { typescript: { getTypeScriptWorker: vi.fn(async () => getWorker) } },
  };
  return { monaco: monaco as unknown as Monaco, model, worker, getWorker, raw: monaco };
}

const at = (line: number) => (line - 1) * 1000;

describe('checkTypes', () => {
  it('type-checks code + type tests in a throwaway model and disposes it', async () => {
    const f = fakeMonaco([], []);
    expect(await checkTypes(f.monaco, 'abc', 'const a = 1;', 'type T = 1;')).toEqual([]);
    expect(f.raw.editor.createModel).toHaveBeenCalledWith('const a = 1;\n\ntype T = 1;', 'typescript', expect.anything());
    expect(f.getWorker.mock.calls[0]![0].toString()).toBe('file:///typecheck-abc.ts');
    expect(f.worker.getSemanticDiagnostics).toHaveBeenCalledWith('file:///typecheck-abc.ts');
    expect(f.model.dispose).toHaveBeenCalledOnce();
  });

  it('maps diagnostics to lines and says whether they are in the type tests', async () => {
    const code = 'const a: number = "x";\nexport {};';
    const tests = 'type T = Broken;';
    // line 1 = code, lines 2-3 = code/blank, line 4 = type tests
    const f = fakeMonaco([{ start: at(1), messageText: 'syntax' }], [{ start: at(4), messageText: 'semantic' }, { messageText: 'no start' }]);
    expect(await checkTypes(f.monaco, 'id', code, tests)).toEqual([
      { inTypeTests: false, line: 1, source: 'const a: number = "x";', message: 'syntax', shouldFail: undefined },
      { inTypeTests: true, line: 4, source: 'type T = Broken;', message: 'semantic', shouldFail: undefined },
      { inTypeTests: false, line: 1, source: 'const a: number = "x";', message: 'no start', shouldFail: undefined },
    ]);
  });

  it('flattens chained diagnostic messages', async () => {
    const chain = { messageText: 'outer', next: [{ messageText: 'mid', next: [{ messageText: 'leaf' }] }, { messageText: 'sibling' }] };
    const f = fakeMonaco([], [{ start: 0, messageText: chain }]);
    const [issue] = await checkTypes(f.monaco, 'id', 'x', '');
    expect(issue.message).toBe('outer mid leaf sibling');
  });

  it('reports an unused @ts-expect-error against the line that should have failed', async () => {
    const tests = '// @ts-expect-error  rejects strings\nfn("x");';
    const f = fakeMonaco([], [{ start: at(3), messageText: "Unused '@ts-expect-error' directive." }]);
    const [issue] = await checkTypes(f.monaco, 'id', 'code', tests);
    expect(issue).toMatchObject({ inTypeTests: true, line: 3, source: 'fn("x");', shouldFail: 'rejects strings' });
  });

  it('takes the reason after the last @ts-expect-error on the line, and the whole line without one', async () => {
    const directive = "Unused '@ts-expect-error' directive.";
    const f = fakeMonaco(
      [],
      [
        { start: at(3), messageText: directive },
        { start: at(5), messageText: directive },
        { start: at(7), messageText: directive },
      ],
    );
    const tests = ['/* @ts-expect-error */ // @ts-expect-error\t  why', 'a;', '// @ts-expect-error', 'b;', 'no directive here', 'c;'].join('\n');
    const issues = await checkTypes(f.monaco, 'id', 'code', tests);
    expect(issues.map((i) => i.shouldFail)).toEqual(['why', '', 'no directive here']);
  });

  it('extracts the reason in linear time on a long line', async () => {
    const f = fakeMonaco([], [{ start: at(3), messageText: "Unused '@ts-expect-error' directive." }]);
    const start = performance.now();
    const [issue] = await checkTypes(f.monaco, 'id', 'code', 'x'.repeat(50_000));
    expect(performance.now() - start).toBeLessThan(50);
    expect(issue.shouldFail).toBe('x'.repeat(50_000));
  });

  it('disposes the model even when the TS worker fails', async () => {
    const f = fakeMonaco([], []);
    f.worker.getSyntacticDiagnostics.mockRejectedValueOnce(new Error('worker died'));
    await expect(checkTypes(f.monaco, 'id', 'x', '')).rejects.toThrow('worker died');
    expect(f.model.dispose).toHaveBeenCalledOnce();
  });
});
