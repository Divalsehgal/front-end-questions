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
