import { act, render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf } from '../content/registry';
import { applyHead, headTags, renderHead, SEO_ATTR } from './head';
import { pageMeta, type PageMeta } from './meta';
import { Seo } from './Seo';
import { SITE_URL } from './site';

const meta: PageMeta = {
  title: 'A <b> & "c"',
  description: 'Desc "quoted" <tag>',
  canonical: 'https://example.com/a/',
  noindex: false,
  ogType: 'article',
  jsonLd: [{ '@type': 'Thing', name: '</script>' }],
};

const tag = (sel: string) => document.head.querySelector(sel);

beforeEach(() => {
  document.head.innerHTML = '<meta charset="utf-8"><link rel="icon" href="/favicon.svg">';
});

describe('renderHead', () => {
  it('renders an escaped title, meta, canonical, Open Graph, Twitter and JSON-LD tags', () => {
    const html = renderHead(meta);
    expect(html).toContain('<title>A &lt;b&gt; &amp; &quot;c&quot;</title>');
    expect(html).toContain('<meta name="description" content="Desc &quot;quoted&quot; &lt;tag&gt;" data-seo>');
    expect(html).toContain('<link rel="canonical" href="https://example.com/a/" data-seo>');
    expect(html).toContain('<meta property="og:url" content="https://example.com/a/" data-seo>');
    expect(html).toContain(`<meta property="og:image" content="${SITE_URL}og-image.png" data-seo>`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" data-seo>');
    expect(html).toContain(String.raw`<script type="application/ld+json" data-seo>{"@type":"Thing","name":"\u003c/script\u003e"}</script>`);
    expect(html).not.toContain('robots');
  });

  it('adds robots noindex and drops the canonical for noindex pages', () => {
    const tags = headTags({ ...meta, canonical: null, noindex: true });
    expect(tags).toContainEqual({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, follow' } });
    expect(tags.some((t) => t.tag === 'link')).toBe(false);
  });
});

describe('applyHead', () => {
  it('replaces only the tags it owns', () => {
    applyHead(meta);
    applyHead({ ...meta, title: 'Second', canonical: null, noindex: true, jsonLd: [] });
    expect(document.title).toBe('Second');
    expect(tag('link[rel="canonical"]')).toBeNull();
    expect(tag('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(tag('meta[charset]')).not.toBeNull();
    expect(tag('link[rel="icon"]')).not.toBeNull();
    expect(document.head.querySelectorAll(`[${SEO_ATTR}]`).length).toBeGreaterThan(5);
  });

  it('writes JSON-LD as script text', () => {
    applyHead(meta);
    expect(JSON.parse(tag('script[type="application/ld+json"]')!.textContent!)).toEqual(meta.jsonLd[0]);
  });
});

describe('Seo', () => {
  let go: (to: string) => void = () => {};
  function Nav() {
    go = useNavigate();
    return null;
  }

  it('follows client-side navigation', async () => {
    const e = ALL[0];
    render(
      <MemoryRouter initialEntries={['/']}>
        <Seo />
        <Nav />
      </MemoryRouter>,
    );
    expect(document.title).toBe(pageMeta('/').title);
    await act(async () => go(hrefOf(e.key)));
    expect(document.title).toBe(pageMeta(hrefOf(e.key)).title);
    expect(tag('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${hrefOf(e.key).slice(1)}`);
    await act(async () => go('/review'));
    expect(tag('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  });
});
