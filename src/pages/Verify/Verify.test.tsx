import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BANK as SUBJECTS } from '../../content/bank';
import { ALL } from '../../content/registry';
import { runCodeTests, runSnippet } from '../../runtime/sandbox';
import { checkTypes } from '../../runtime/typecheck';
import { renderWithRouter } from '../../test/render';
import { renderPreview } from './renderPreview';
import { runPool } from './Verify';
import Verify, { checkCode, checkStatic, checkUi, verify } from '.';
import type { CodeQuestion, Question, UiQuestion } from '../../content/types';

vi.mock('../../runtime/sandbox', () => ({ runCodeTests: vi.fn(), runSnippet: vi.fn() }));
vi.mock('../../runtime/typecheck', () => ({ checkTypes: vi.fn() }));
vi.mock('sucrase', () => ({
  transform: (src: string) => {
    if (src.includes('BROKEN')) throw new Error('bad syntax');
    return { code: src };
  },
}));

const ok = (name = 't') => ({ name, ok: true, ms: 0 });
const bad = (name = 't') => ({ name, ok: false, error: 'nope', ms: 0 });
const code: CodeQuestion = { kind: 'code', id: 'c', title: 'C', prompt: '', starter: 's', tests: 'tests', solution: 'sol' };
const ui: UiQuestion = {
  kind: 'ui',
  id: 'u',
  title: 'U',
  prompt: '',
  framework: 'react',
  requirements: ['r'],
  starter: 'export default 1',
  solution: 'export default 2',
};

beforeEach(() => {
  vi.mocked(runCodeTests).mockReset();
  vi.mocked(runSnippet).mockReset();
  vi.mocked(checkTypes).mockReset();
});

describe('checkStatic', () => {
  const quiz = { kind: 'quiz', id: 'q', title: 'q', prompt: '', options: ['a', 'b'], answer: 1, why: '' } as Question;
  it.each([
    [quiz, true, '2 options'],
    [{ ...quiz, answer: [0, 5] }, false, 'answer index out of range'],
    [{ ...quiz, options: ['a', 'a'] }, false, 'duplicate options'],
    [{ kind: 'flashcard', id: 'f', title: 'f', front: 'x', back: ' ' }, false, 'empty side'],
    [{ kind: 'flashcard', id: 'f', title: 'f', front: 'x', back: 'y' }, true, 'ok'],
    [{ kind: 'order', id: 'o', title: 'o', prompt: '', items: ['a', 'b'], why: '' }, false, 'needs at least 3 items'],
    [{ kind: 'order', id: 'o', title: 'o', prompt: '', items: ['a', 'a', 'b'], why: '' }, false, 'duplicate items'],
    [{ kind: 'order', id: 'o', title: 'o', prompt: '', items: ['a', 'b', 'c'], why: '' }, true, '3 items'],
  ] as [Question, boolean, string][])('checks %o', (q, pass, detail) => {
    expect(checkStatic(q)).toEqual({ ok: pass, detail });
  });

  it('defers sandboxed kinds', () => {
    expect(checkStatic(code)).toBeNull();
  });
});

describe('checkCode', () => {
  it('requires the starter to fail and the solution to pass', async () => {
    vi.mocked(runCodeTests).mockResolvedValueOnce({ kind: 'code' as const, results: [ok()], logs: [] });
    expect(await checkCode(code)).toEqual({ ok: false, detail: 'starter already passes every test' });
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [ok(), bad('edge')], logs: [] });
    expect((await checkCode(code)).detail).toBe('solution fails: edge → nope');
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [], logs: [], fatal: 'boom' });
    expect((await checkCode(code)).detail).toBe('solution: boom');
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [], logs: [] });
    expect((await checkCode(code)).detail).toBe('no tests registered');
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [ok()], logs: [] });
    expect(await checkCode(code)).toEqual({ ok: true, detail: '1 tests pass' });
    vi.mocked(runCodeTests).mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] });
    expect(await checkCode({ ...code, solution: undefined })).toEqual({ ok: true, detail: 'no reference solution to check' });
  });

  it('also type-checks the solution when there are type tests', async () => {
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [ok()], logs: [] });
    vi.mocked(checkTypes).mockResolvedValueOnce([{ inTypeTests: true, line: 1, source: 'x', message: 'm' }]);
    expect((await checkCode({ ...code, typeTests: 'tt' })).detail).toBe('types: x → m');
    vi.mocked(runCodeTests)
      .mockResolvedValueOnce({ kind: 'code' as const, results: [bad()], logs: [] })
      .mockResolvedValueOnce({ kind: 'code' as const, results: [ok()], logs: [] });
    vi.mocked(checkTypes).mockResolvedValueOnce([]);
    expect((await checkCode({ ...code, typeTests: 'tt' })).detail).toBe('1 tests pass + types');
  });

  it('judges type challenges by the type checker alone', async () => {
    const tc = { ...code, tests: undefined, typeTests: 'tt' };
    vi.mocked(checkTypes).mockResolvedValueOnce([]);
    expect((await checkCode(tc)).detail).toBe('starter already passes the type tests');
    const issue = { inTypeTests: true, line: 1, source: 'y', message: '', shouldFail: 'should error' };
    vi.mocked(checkTypes).mockResolvedValueOnce([issue]).mockResolvedValueOnce([issue]);
    expect((await checkCode(tc)).detail).toBe('types: y → should error');
    vi.mocked(checkTypes).mockResolvedValueOnce([issue]).mockResolvedValueOnce([]);
    expect((await checkCode(tc)).ok).toBe(true);
    vi.mocked(checkTypes).mockResolvedValueOnce([issue]);
    expect((await checkCode({ ...tc, solution: undefined })).detail).toBe('no reference solution to check');
    expect((await checkCode({ ...tc, typeTests: undefined })).detail).toBe('no tests or type tests');
  });
});

describe('checkUi', () => {
  it('compiles React answers and renders the reference', async () => {
    const render = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce('ReferenceError: x');
    expect(await checkUi(ui, render)).toEqual({ ok: true, detail: '1 requirements + reference renders' });
    expect((await checkUi(ui, render)).detail).toBe('reference preview: ReferenceError: x');
    expect((await checkUi({ ...ui, starter: 'BROKEN' }, render)).detail).toMatch(/starter does not compile: Error: bad syntax/);
    expect((await checkUi({ ...ui, starter: 'function App() {}' }, render)).detail).toBe('starter has no default export');
    expect((await checkUi({ ...ui, requirements: [] }, render)).detail).toBe('no requirements');
    expect(await checkUi({ ...ui, framework: 'vanilla', solution: undefined }, render)).toEqual({ ok: true, detail: '1 requirements' });
  });
});

describe('verify', () => {
  it('checks output snippets', async () => {
    const out = { key: 'k', subject: SUBJECTS[0], topic: SUBJECTS[0].topics[0], q: { kind: 'output', id: 'o', title: 'o', code: 'x', why: '' } as Question };
    vi.mocked(runSnippet).mockResolvedValueOnce([]);
    expect((await verify(out)).detail).toBe('logs nothing');
    vi.mocked(runSnippet).mockResolvedValueOnce(['⏱ timeout']);
    expect((await verify(out)).detail).toBe('timed out');
    vi.mocked(runSnippet).mockResolvedValueOnce(['1', '2']);
    expect(await verify(out)).toEqual({ key: 'k', ok: true, detail: '1 ⏎ 2' });
    vi.mocked(runCodeTests).mockResolvedValue({ kind: 'code' as const, results: [bad()], logs: [] });
    expect(await verify({ ...out, q: { ...code, solution: undefined } })).toEqual({ key: 'k', ok: true, detail: 'no reference solution to check' });
    expect((await verify({ ...out, q: { ...ui, requirements: [] } })).detail).toBe('no requirements');
    expect((await verify({ ...out, q: { kind: 'flashcard', id: 'f', title: 'f', front: 'a', back: 'b' } })).detail).toBe('ok');
  });
});

describe('renderPreview', () => {
  it('resolves null on ready and the message on error, removing the frame', async () => {
    const pending = renderPreview('vanilla', '<p>x</p>');
    const frame = await vi.waitFor(() => document.querySelector('iframe')!);
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, origin: 'null', data: { source: 'other', type: 'ready' } }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, origin: 'null', data: { source: 'fe-grind-preview', type: 'ready' } }));
    expect(await pending).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();

    const failing = renderPreview('vanilla', '<p>x</p>');
    const frame2 = await vi.waitFor(() => document.querySelector('iframe')!);
    const error = { source: 'fe-grind-preview', type: 'error', message: 'boom' };
    window.dispatchEvent(new MessageEvent('message', { source: frame2.contentWindow, origin: 'null', data: error }));
    expect(await failing).toBe('boom');
  });

  it('ignores messages from another window or a real origin', async () => {
    const pending = renderPreview('vanilla', '<p>x</p>', 50);
    const frame = await vi.waitFor(() => document.querySelector('iframe')!);
    const ready = { source: 'fe-grind-preview', type: 'ready' };
    window.dispatchEvent(new MessageEvent('message', { source: window, origin: 'null', data: ready }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, origin: 'https://evil.example', data: ready }));
    window.dispatchEvent(new MessageEvent('message', { source: frame.contentWindow, data: ready }));
    expect(await pending).toMatch(/did not report ready/);
  });

  it('times out', async () => {
    expect(await renderPreview('react', 'export default 1', 10)).toMatch(/did not report ready/);
  });
});

describe('runPool', () => {
  it('runs every entry and turns thrown errors into failures', async () => {
    const seen: string[] = [];
    const check = vi.fn(async (e: (typeof ALL)[number]) => {
      if (e === ALL[1]) throw new Error('crash');
      return { key: e.key, ok: true, detail: '' };
    });
    await runPool(ALL.slice(0, 3), check, (r) => seen.push(`${r.key}:${r.ok}:${r.detail}`), 2);
    expect(seen).toHaveLength(3);
    expect(seen).toContain(`${ALL[1].key}:false:Error: crash`);
  });
});

describe('Verify page', () => {
  it('runs the checks for the chosen subject and filters failing results', async () => {
    const subject = SUBJECTS[0];
    const scope = ALL.filter((e) => e.subject.slug === subject.slug);
    const failKey = scope[0].key;
    const check = vi.fn(async (e: (typeof ALL)[number]) => ({ key: e.key, ok: e.key !== failKey, detail: e.key === failKey ? 'broken' : 'fine' }));
    const { user } = renderWithRouter(<Verify check={check} />);
    await user.click(screen.getByRole('radio', { name: subject.title }));
    await user.click(screen.getByRole('button', { name: `Run ${scope.length}` }));
    expect(await screen.findByText('broken')).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole('button', { name: `Run ${scope.length}` })).toBeEnabled());
    expect(check).toHaveBeenCalledTimes(scope.length);
    expect(screen.getByTestId('verify-summary')).toHaveTextContent(`${scope.length} / ${scope.length} checked · ${scope.length - 1} ok · 1 failing`);
    expect(screen.getByRole('list', { name: 'Check results' }).children).toHaveLength(1);
    expect(screen.getByText('broken')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'All' }));
    expect(screen.getByRole('list', { name: 'Check results' }).children).toHaveLength(scope.length);
    expect(screen.getAllByRole('img', { name: 'Pass' })).toHaveLength(scope.length - 1);
  });
});
