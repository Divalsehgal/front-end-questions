// CI gate for content: the same checks as the /verify page, runnable with `npm test`.
import { transform } from 'sucrase';
import { describe, expect, it } from 'vitest';
import { runDrill, runSnippet } from '../test/sandbox';
import { typeErrors } from '../test/typecheck';
import { BANK_ENTRIES as ALL } from './bank';
import type { CodeQuestion, Question, UiQuestion } from './types';

const of = <K extends Question['kind']>(kind: K) => ALL.filter((e) => e.q.kind === kind) as unknown as { key: string; q: Extract<Question, { kind: K }> }[];

describe('content structure', () => {
  it('every question key is unique', () => {
    const keys = ALL.map((e) => e.key);
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
  });

  it.each(of('quiz').map((e) => [e.key, e.q] as const))('%s has valid options and answers', (_, q) => {
    const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(new Set(q.options).size).toBe(q.options.length);
    for (const a of answers) expect(a >= 0 && a < q.options.length).toBe(true);
    expect(q.why.trim()).not.toBe('');
  });

  it.each(of('order').map((e) => [e.key, e.q] as const))('%s has at least 3 distinct items', (_, q) => {
    expect(q.items.length).toBeGreaterThanOrEqual(3);
    expect(new Set(q.items).size).toBe(q.items.length);
  });

  it.each(of('flashcard').map((e) => [e.key, e.q] as const))('%s has both sides', (_, q) => {
    expect(q.front.trim()).not.toBe('');
    expect(q.back.trim()).not.toBe('');
  });

  it.each(of('ui').map((e) => [e.key, e.q] as const))('%s compiles and has requirements', (_, q: UiQuestion) => {
    expect(q.requirements.length).toBeGreaterThan(0);
    if (q.framework !== 'react') return;
    for (const src of [q.starter, q.solution].filter(Boolean) as string[]) {
      expect(() => transform(src, { transforms: ['typescript', 'jsx'], jsxRuntime: 'automatic' })).not.toThrow();
      expect(src).toMatch(/export default/);
    }
  });
});

describe('output snippets run', () => {
  it.each(of('output').map((e) => [e.key, e.q] as const))('%s logs something', async (_, q) => {
    const lines = await runSnippet(q.code, q.lang);
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('coding drills', () => {
  const drills = of('code').filter((e) => e.q.tests) as { key: string; q: CodeQuestion & { tests: string } }[];

  it.each(drills.map((e) => [e.key, e.q] as const))('%s: reference passes, starter fails', async (_, q) => {
    if (q.solution) {
      const { results, fatal } = await runDrill(q.solution, q.tests);
      expect(fatal).toBeUndefined();
      expect(results.length).toBeGreaterThan(0);
      expect(results.filter((r) => !r.ok).map((r) => `${r.name}: ${r.error}`)).toEqual([]);
    }
    const starter = await runDrill(q.starter, q.tests);
    expect(!starter.fatal && starter.results.length > 0 && starter.results.every((r) => r.ok)).toBe(false);
  });

  it.each(
    of('code')
      .filter((e) => e.q.typeTests)
      .map((e) => [e.key, e.q] as const),
  )('%s: type tests', (_, q) => {
    if (q.solution) expect(typeErrors(q.solution, q.typeTests!)).toEqual([]);
    if (!q.tests) expect(typeErrors(q.starter, q.typeTests!).length).toBeGreaterThan(0);
  });
});
