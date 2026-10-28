// Server render smoke test, in plain Node (no window/document/localStorage): every kind of
// question page renders its crawlable content, exactly as scripts/prerender.js does at build time.
import { describe, expect, it } from 'vitest';
import { BANK_ENTRIES as ALL } from '../content/bank';
import { hrefOf, subjectHref, type FullEntry as Entry } from '../content/registry';
import { render } from '../entry-server';
import { stripMarkdown } from './text';
import type { Kind } from '../content/types';

const DECODE: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'" };
/** Visible text of server HTML: tags and React's text separators dropped, entities decoded, whitespace collapsed. */
const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|#x27|#39);/g, (m) => DECODE[m])
    .replace(/\s+/g, ' ');
/** The opening of a markdown-lite field as plain text, cut before any code fence or table. */
const opening = (md: string) =>
  stripMarkdown(md.split(/```|\n\|/)[0].split('\n')[0])
    .slice(0, 40)
    .trim();
const first = (kind: Kind) => ALL.find((e) => e.q.kind === kind)!;
const page = (e: Entry) => render(hrefOf(e.key));

describe('server render', () => {
  it('runs without a browser environment', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof localStorage).toBe('undefined');
  });

  it('renders a quiz page with title, prompt, options and the explanation in a closed <details>', () => {
    const e = first('quiz');
    if (e.q.kind !== 'quiz') throw new Error('unreachable');
    const { html, head } = page(e);
    const text = textOf(html);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(text).toContain(stripMarkdown(e.q.title));
    expect(text).toContain(opening(e.q.prompt));
    for (const o of e.q.options) expect(text).toContain(opening(o));
    expect(html).toMatch(/<details[^>]*>(?!.*<details).*Show answer &amp; explanation/s);
    expect(html).not.toMatch(/<details[^>]* open/);
    expect(text).toContain(opening(e.q.why));
    expect(head).toContain('<link rel="canonical"');
    expect(head).toContain('"@type":"Quiz"');
  });

  it.each(['output', 'order'] as const)('renders the %s explanation', (kind) => {
    const e = first(kind);
    expect(textOf(page(e).html)).toContain(opening((e.q as { why: string }).why));
  });

  it('renders the flashcard back, and code / ui prompts with their reference solution', () => {
    const card = first('flashcard');
    expect(textOf(page(card).html)).toContain(opening((card.q as { back: string }).back));
    for (const kind of ['code', 'ui'] as const) {
      const e = ALL.find((x) => x.q.kind === kind && 'solution' in x.q && x.q.solution)!;
      const text = textOf(page(e).html);
      expect(text).toContain(opening((e.q as { prompt: string }).prompt));
      expect(text).toContain('Show reference solution');
      expect(text).toContain('Loading editor');
    }
    const ui = first('ui');
    if (ui.q.kind === 'ui') expect(textOf(page(ui).html)).toContain(opening(ui.q.requirements[0]));
  });

  it('links to related questions, the subject and the breadcrumb trail with real hrefs', () => {
    const e = first('quiz');
    const { html } = page(e);
    expect(html).toContain(`href="${import.meta.env.BASE_URL}${subjectHref(e.subject.slug).slice(1)}"`);
    expect(html).toMatch(/aria-label="Breadcrumb"/);
    expect(html.match(/href="[^"]*\/q\//g)!.length).toBeGreaterThan(2);
  });

  it('renders subject pages with every question as a link, and the home page intro', () => {
    const e = ALL[0];
    const { html } = render(subjectHref(e.subject.slug));
    const count = ALL.filter((x) => x.subject === e.subject).length;
    expect(html.match(/href="[^"]*\/q\//g)!.length).toBeGreaterThanOrEqual(count);
    expect(textOf(render('/').html)).toContain('free frontend interview practice with no login');
  });
});
