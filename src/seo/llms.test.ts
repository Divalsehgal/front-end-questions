import { describe, expect, it } from 'vitest';
import { BANK_ENTRIES as ALL } from '../content/bank';
import { SUBJECTS } from '../content/registry';
import { fence, llmsFullTxt, llmsTxt } from './llms';
import { SITE_URL } from './site';

const sections = (md: string) => md.split('\n\n### ').slice(1);

describe('llms.txt', () => {
  const txt = llmsTxt();

  it('follows the llmstxt.org shape: H1 name, summary quote, H2 sections of links', () => {
    expect(txt.startsWith('# FE Grind (Front End Grind)\n\n> ')).toBe(true);
    expect(txt).toContain('\n## Optional\n');
    expect(txt).toContain(`(${SITE_URL}llms-full.txt)`);
  });

  it('links every subject page', () => {
    for (const s of SUBJECTS) expect(txt).toContain(`(${SITE_URL}s/${s.slug}/)`);
  });
});

describe('llms-full.txt', () => {
  const full = llmsFullTxt();

  it('has one section per question, each with its page URL', () => {
    expect(sections(full)).toHaveLength(ALL.length);
    for (const e of ALL.slice(0, 50)) expect(full).toContain(`Source: ${SITE_URL}q/${e.subject.slug}/${e.q.id}/`);
  });

  it('includes the answer for every kind that has one', () => {
    const quiz = ALL.find((e) => e.q.kind === 'quiz')!;
    if (quiz.q.kind !== 'quiz') throw new Error('no quiz');
    const first = Array.isArray(quiz.q.answer) ? quiz.q.answer[0] : quiz.q.answer;
    const section = sections(full).find((s) => s.includes(`Source: ${SITE_URL}q/${quiz.subject.slug}/${quiz.q.id}/`))!;
    expect(section).toContain(`**Answer:** ${String.fromCodePoint(65 + first)}. ${quiz.q.options[first]}`);
    expect(section).toContain(`**Why:** ${quiz.q.why}`);

    const code = ALL.find((e) => e.q.kind === 'code' && e.q.solution)!;
    if (code.q.kind !== 'code') throw new Error('no code');
    expect(full).toContain(code.q.solution!.trimEnd());
  });
});

describe('fence', () => {
  it('outgrows any backtick run in the code', () => {
    expect(fence('a', 'js')).toBe('```js\na\n```');
    expect(fence('const s = `x ${"```"}`;')).toMatch(/^````\n/);
  });
});
