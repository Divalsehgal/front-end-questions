// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ALL, hrefOf, SUBJECTS } from '../content/registry';
import { absoluteUrl, SITE_URL } from './site';
import { buildSitemaps, prerenderPaths, robotsTxt, SITEMAP_INDEX, sitemapFile } from './sitemap';

const lastmod = (slug: string) => (slug === 'react' ? '2026-01-02' : undefined);
const { files, urls } = buildSitemaps(lastmod, '2026-10-27');

const parse = (xml: string) => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
  return doc;
};
const locs = (xml: string) => [...parse(xml).getElementsByTagName('loc')].map((l) => l.textContent!);

describe('sitemaps', () => {
  it('lists every registry question with a valid absolute URL under SITE_URL', () => {
    const all = Object.entries(files)
      .filter(([path]) => path !== SITEMAP_INDEX)
      .flatMap(([, xml]) => locs(xml));
    for (const e of ALL) expect(all).toContain(absoluteUrl(hrefOf(e.key)));
    for (const url of all) {
      expect(() => new URL(url)).not.toThrow();
      expect(url.startsWith(SITE_URL)).toBe(true);
      expect(url).toMatch(/\/$/);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  it('lists exactly the prerendered pages', () => {
    expect([...urls].sort()).toEqual(prerenderPaths().map(absoluteUrl).sort());
    expect(prerenderPaths()).toHaveLength(1 + SUBJECTS.length + ALL.length);
  });

  it('has an index pointing at one well-formed sitemap per subject plus the core pages', () => {
    const index = parse(files[SITEMAP_INDEX]);
    expect(index.documentElement.tagName).toBe('sitemapindex');
    expect(index.documentElement.getAttribute('xmlns')).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
    const listed = locs(files[SITEMAP_INDEX]);
    expect(listed).toEqual(['pages', ...SUBJECTS.map((s) => s.slug)].map((n) => SITE_URL + sitemapFile(n)));
    for (const s of SUBJECTS) expect(parse(files[sitemapFile(s.slug)]).documentElement.tagName).toBe('urlset');
  });

  it('uses the subject lastmod when known and the build date otherwise', () => {
    expect(files[sitemapFile('react')]).toContain('<lastmod>2026-01-02</lastmod>');
    expect(files[sitemapFile('javascript')]).toContain('<lastmod>2026-10-27</lastmod>');
    expect(files[sitemapFile('pages')]).toContain(`<loc>${SITE_URL}</loc><lastmod>2026-10-27</lastmod>`);
  });
});

describe('robots.txt', () => {
  it('allows crawling, disallows progress-only routes under the base path and points at the sitemap index', () => {
    const base = new URL(SITE_URL).pathname;
    const txt = robotsTxt();
    expect(txt).toMatch(/^User-agent: \*\nAllow: \//);
    for (const r of ['review', 'mock', 'session', 'verify']) expect(txt).toContain(`Disallow: ${base}${r}\n`);
    expect(txt).toContain(`Sitemap: ${SITE_URL}sitemap.xml`);
  });
});
