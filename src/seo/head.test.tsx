import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ALL, hrefOf } from '../content/registry';
import { JsonLd, toMetadata } from './head';
import { pageMeta, type PageMeta } from './meta';
import { SITE_URL } from './site';

const meta: PageMeta = {
  title: 'A <b> & "c"',
  description: 'Desc "quoted" <tag>',
  canonical: 'https://example.com/a/',
  noindex: false,
  ogType: 'article',
  jsonLd: [{ '@type': 'Thing', name: '</script>' }],
};

describe('toMetadata', () => {
  it('maps title, description, canonical, Open Graph and Twitter tags', () => {
    const m = toMetadata(meta);
    expect(m.title).toEqual({ absolute: meta.title });
    expect(m.description).toBe(meta.description);
    expect(m.alternates).toEqual({ canonical: meta.canonical });
    expect(m.robots).toBeUndefined();
    expect(m.openGraph).toMatchObject({
      type: 'article',
      url: meta.canonical,
      locale: 'en_US',
      images: [{ url: `${SITE_URL}og-image.png`, width: 1200, height: 630 }],
    });
    expect(m.twitter).toMatchObject({ card: 'summary_large_image', title: meta.title, images: [`${SITE_URL}og-image.png`] });
  });

  it('adds robots noindex, follow and drops the canonical for noindex pages', () => {
    const m = toMetadata({ ...meta, canonical: null, noindex: true });
    expect(m.robots).toEqual({ index: false, follow: true });
    expect(m.alternates).toBeUndefined();
    expect(m.openGraph).not.toHaveProperty('url');
  });

  it('gives question pages their own canonical URL', () => {
    const path = hrefOf(ALL[0].key);
    expect(toMetadata(pageMeta(path)).alternates).toEqual({ canonical: `${SITE_URL}${path.slice(1)}` });
    expect(toMetadata(pageMeta('/review')).robots).toEqual({ index: false, follow: true });
  });
});

describe('JsonLd', () => {
  it('writes each JSON-LD object as an escaped script', () => {
    const { container } = render(<JsonLd meta={meta} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toContain('</script');
    expect(JSON.parse(script.textContent!)).toEqual(meta.jsonLd[0]);
  });
});
