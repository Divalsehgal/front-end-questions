import { describe, expect, it } from 'vitest';
import { BANK_ENTRIES as ALL } from '../content/bank';
import { hrefOf, subjectHref } from '../content/registry';
import { DESCRIPTION_MAX, metaDescription, pageMeta, pageTitle, questionLead, TITLE_MAX } from './meta';
import { absoluteUrl, SITE_URL } from './site';
import { prerenderPaths } from './sitemap';

const MARKDOWN = /`|\*\*|```/;

describe('pageTitle', () => {
  it('uses the longest form that fits in 60 characters', () => {
    expect(pageTitle('Closures', ['JavaScript interview question', 'JavaScript'])).toBe('Closures — JavaScript interview question | FE Grind');
    const mid = pageTitle('Generators vs async/await', ['JavaScript interview question', 'JavaScript']);
    expect(mid).toBe('Generators vs async/await — JavaScript | FE Grind');
  });

  it('drops the subject, then truncates very long titles', () => {
    const long = pageTitle('A very long question title that keeps going and going and going on', ['React']);
    expect(long.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(long).toMatch(/… \| FE Grind$/);
    expect(pageTitle('`useEffect` cleanup', [])).toBe('useEffect cleanup | FE Grind');
  });
});

describe('metaDescription', () => {
  it('joins parts, strips markdown and caps at 155 characters', () => {
    expect(metaDescription('Use **`useMemo`**', '', 'sparingly.')).toBe('Use useMemo sparingly.');
    expect(metaDescription('word '.repeat(60)).length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });
});

describe('pageMeta', () => {
  it('gives every prerendered page a unique, clean title and description within limits, and a canonical URL', () => {
    const metas = prerenderPaths().map((p) => [p, pageMeta(p)] as const);
    for (const [path, m] of metas) {
      expect(m.title.length, m.title).toBeLessThanOrEqual(TITLE_MAX);
      expect(m.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(m.description.length).toBeGreaterThan(20);
      expect(m.title + m.description).not.toMatch(MARKDOWN);
      expect(m.canonical).toBe(absoluteUrl(path));
      expect(m.noindex).toBe(false);
    }
    const titles = new Set(metas.map(([, m]) => m.title));
    // Titles repeat only where two questions in one subject share a title.
    expect(titles.size).toBeGreaterThan(metas.length * 0.95);
  });

  it('describes the home page as the site', () => {
    const home = pageMeta('/');
    expect(home.canonical).toBe(SITE_URL);
    expect(home.title).toMatch(/^FE Grind/);
    expect(home.jsonLd[0]).toMatchObject({ '@type': 'WebSite' });
  });

  it('builds subject and question pages from the registry', () => {
    const subject = pageMeta(subjectHref('react'));
    expect(subject.title).toMatch(/React/);
    expect(subject.description).toMatch(/free React interview questions/);
    expect(subject.ogType).toBe('website');

    const e = ALL.find((x) => x.subject.slug === 'react')!;
    const q = pageMeta(hrefOf(e.key).replace(/\/$/, ''));
    expect(q.canonical).toBe(absoluteUrl(hrefOf(e.key)));
    expect(q.ogType).toBe('article');
    expect(q.jsonLd.map((d) => (d as { '@type': string })['@type'])).toContain('BreadcrumbList');
  });

  it('noindexes progress-only routes and unknown paths, without a canonical', () => {
    for (const path of ['/review', '/mock', '/session/', '/settings', '/architecture', '/verify']) {
      const m = pageMeta(path);
      expect(m.noindex).toBe(true);
      expect(m.canonical).toBeNull();
      expect(m.jsonLd).toEqual([]);
    }
    expect(pageMeta('/review').title).toBe('Review | FE Grind');
    expect(pageMeta('/nope').title).toBe('Page not found | FE Grind');
    expect(pageMeta('/q/react/does-not-exist').noindex).toBe(true);
    expect(pageMeta('/q/react/a/b').noindex).toBe(true);
    expect(pageMeta('/s/nope').noindex).toBe(true);
  });
});

describe('questionLead', () => {
  it('uses the prompt, the flashcard front, or an output prompt', () => {
    const lead = (kind: string) => questionLead(ALL.find((e) => e.q.kind === kind)!);
    expect(lead('flashcard')).toBe((ALL.find((e) => e.q.kind === 'flashcard')!.q as { front: string }).front);
    expect(lead('output')).toMatch(/^What does this (JavaScript|TypeScript) code log\?/);
    expect(lead('quiz')).toBe((ALL.find((e) => e.q.kind === 'quiz')!.q as { prompt: string }).prompt);
  });

  it('names TypeScript for ts output snippets', () => {
    const ts = ALL.find((e) => e.q.kind === 'output' && e.q.lang === 'ts');
    if (ts) expect(questionLead(ts)).toMatch(/TypeScript/);
  });
});
