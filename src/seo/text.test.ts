import { describe, expect, it } from 'vitest';
import { absoluteUrl, isNoindex, normalizePath, SITE_URL } from './site';
import { escapeHtml, fitFirst, stripMarkdown, truncate } from './text';

describe('stripMarkdown', () => {
  it('removes the Prose dialect: bold, inline code, emphasis, links, bullets, tables and fences', () => {
    expect(stripMarkdown('Use **`useEffect`** to _sync_ with [docs](https://x.dev).')).toBe('Use useEffect to sync with docs.');
    expect(stripMarkdown('Intro:\n- one\n- two\n1. three')).toBe('Intro: one two three');
    expect(stripMarkdown('| a | b |\n| --- | --- |\n| 1 | 2 |')).toBe('a b 1 2');
    expect(stripMarkdown('Before\n```js\nconsole.log(1)\n```\nAfter')).toBe('Before After');
    expect(stripMarkdown('# Title\n\nbody')).toBe('Title body');
    expect(stripMarkdown('a * b * c')).toBe('a * b * c');
  });

  it('unwraps links the way the leftmost-match regex did, including unbalanced brackets', () => {
    expect(stripMarkdown('[a [b](c) d')).toBe('a [b d');
    expect(stripMarkdown('[](x) [y](z')).toBe('[](x) [y](z');
    expect(stripMarkdown('[ok](u) and [no] (v) and [x](')).toBe('ok and [no] (v) and [x](');
  });

  it('strips list markers, table rules and headings across blank and indented lines', () => {
    expect(stripMarkdown('Intro\n\n\n- a\n\n  * b\n-\nc')).toBe('Intro a b c');
    expect(stripMarkdown('|a|\n\n | :--- | ---: |\n|1|')).toBe('a 1');
    expect(stripMarkdown('| x\n---')).toBe('x');
    expect(stripMarkdown('# H\n## H2\n#nope')).toBe('H H2 #nope');
    expect(stripMarkdown('1. one\n12.two\n3) three')).toBe('one 12.two 3) three');
    expect(stripMarkdown('a\u2028- b')).toBe('a b');
  });

  it.each([
    ['newlines', '\n'.repeat(50_000) + 'x'],
    ['spaces', ' '.repeat(50_000) + 'x'],
    ['open brackets', '['.repeat(50_000)],
    ['link heads', '[a]('.repeat(20_000)],
    ['pipes on lines', '|\n'.repeat(25_000)],
    ['dashes', '-'.repeat(50_000) + 'x'],
    ['digits', '1'.repeat(50_000)],
  ])('runs in linear time on adversarial input (%s)', (_, input) => {
    const start = performance.now();
    stripMarkdown(input);
    expect(performance.now() - start).toBeLessThan(50);
  });
});

describe('truncate', () => {
  it('keeps short text and cuts long text at a word boundary with an ellipsis', () => {
    expect(truncate('short', 10)).toBe('short');
    const out = truncate('The event loop runs microtasks before the next macrotask, always.', 31);
    expect(out.length).toBeLessThanOrEqual(31);
    expect(out).toBe('The event loop runs microtasks…');
  });

  it('hard-cuts when there is no usable space and trims trailing punctuation', () => {
    expect(truncate('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefghi…');
    expect(truncate('Hello there, general kenobi', 14)).toBe('Hello there…');
  });

  it('trims any trailing run of spaces and punctuation before the ellipsis', () => {
    expect(truncate('one two three — four', 15)).toBe('one two three…');
    expect(truncate('a,,,, ;;; ---——', 8)).toBe('a…');
    expect(truncate('word.... next', 10)).toBe('word…');
    expect(truncate('x\u00a0\u00a0\u00a0yyyyyyyy', 6)).toBe('x\u00a0\u00a0\u00a0y…');
  });

  it('runs in linear time on a long punctuation run', () => {
    const start = performance.now();
    expect(truncate(`a${',;'.repeat(50_000)}`, 100_000)).toBe('a…');
    expect(performance.now() - start).toBeLessThan(50);
  });

  it('fitFirst picks the first candidate that fits, else truncates the last', () => {
    expect(fitFirst(['too long here', 'fits'], 6)).toBe('fits');
    expect(fitFirst(['way too long', 'also too long'], 8).length).toBeLessThanOrEqual(8);
  });
});

describe('escapeHtml', () => {
  it('escapes attribute and text metacharacters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});

describe('site URLs', () => {
  it('normalises router paths to one trailing slash', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/q/react/x')).toBe('/q/react/x/');
    expect(normalizePath('q/react/x//?tab=1#h')).toBe('/q/react/x/');
    expect(normalizePath('///')).toBe('/');
    expect(normalizePath('//a//b//#x/')).toBe('/a//b/');
  });

  it('normalises long runs of slashes in linear time', () => {
    const start = performance.now();
    expect(normalizePath(`${'/'.repeat(50_000)}a${'/'.repeat(50_000)}`)).toBe('/a/');
    expect(normalizePath(`a${'/'.repeat(50_000)}b`)).toBe(`/a${'/'.repeat(50_000)}b/`);
    expect(performance.now() - start).toBeLessThan(50);
  });

  it('builds absolute canonical URLs under SITE_URL', () => {
    expect(SITE_URL).toMatch(/^https:\/\/.+\/$/);
    expect(absoluteUrl('/')).toBe(SITE_URL);
    expect(absoluteUrl('/s/react')).toBe(`${SITE_URL}s/react/`);
  });

  it('flags progress-only routes as noindex', () => {
    expect(isNoindex('/review')).toBe(true);
    expect(isNoindex('/mock/')).toBe(true);
    expect(isNoindex('/s/react')).toBe(false);
  });
});
