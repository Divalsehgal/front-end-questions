// Sitemaps and robots.txt, driven by the registry: a new question gets a page and a
// sitemap entry without any extra step. One sitemap per subject, tied together by an index.
import { ALL, hrefOf, SUBJECTS, subjectHref } from '../content/registry';
import { absoluteUrl, NOINDEX_ROUTES, SITE_URL } from './site';
import { escapeHtml } from './text';

export const SITEMAP_INDEX = 'sitemap.xml';
export const sitemapFile = (name: string) => `sitemaps/${name}.xml`;

/** Every router path that gets its own prerendered index.html (and a sitemap entry). */
export function prerenderPaths() {
  return ['/', ...SUBJECTS.map((s) => subjectHref(s.slug)), ...ALL.map((e) => hrefOf(e.key))];
}

export type Sitemaps = {
  /** dist-relative path -> XML. Includes the index at SITEMAP_INDEX. */
  files: Record<string, string>;
  /** Every absolute URL listed, in order. */
  urls: string[];
};

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>';
const NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

const urlset = (entries: { loc: string; lastmod: string }[]) =>
  [XML_HEAD, `<urlset ${NS}>`, ...entries.map((e) => `  <url><loc>${escapeHtml(e.loc)}</loc><lastmod>${e.lastmod}</lastmod></url>`), '</urlset>', ''].join(
    '\n',
  );

/**
 * `lastmod(subject)` returns a W3C date (YYYY-MM-DD) for a subject's content, e.g. its last git
 * commit; `fallback` (the build date) is used for the home page and when it returns nothing.
 */
export function buildSitemaps(lastmod: (subject: string) => string | undefined, fallback: string): Sitemaps {
  const groups = [
    { name: 'pages', lastmod: fallback, paths: ['/'] },
    ...SUBJECTS.map((s) => ({
      name: s.slug,
      lastmod: lastmod(s.slug) ?? fallback,
      paths: [subjectHref(s.slug), ...ALL.filter((e) => e.subject.slug === s.slug).map((e) => hrefOf(e.key))],
    })),
  ];
  const files: Record<string, string> = {};
  for (const g of groups) files[sitemapFile(g.name)] = urlset(g.paths.map((p) => ({ loc: absoluteUrl(p), lastmod: g.lastmod })));
  files[SITEMAP_INDEX] = [
    XML_HEAD,
    `<sitemapindex ${NS}>`,
    ...groups.map((g) => `  <sitemap><loc>${escapeHtml(SITE_URL + sitemapFile(g.name))}</loc><lastmod>${g.lastmod}</lastmod></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n');
  return { files, urls: groups.flatMap((g) => g.paths.map(absoluteUrl)) };
}

/** robots.txt: everything crawlable except the progress-only routes, plus the sitemap index. */
export function robotsTxt() {
  const base = new URL(SITE_URL).pathname;
  return ['User-agent: *', 'Allow: /', ...NOINDEX_ROUTES.map((r) => `Disallow: ${base}${r.slice(1)}`), '', `Sitemap: ${SITE_URL}${SITEMAP_INDEX}`, ''].join(
    '\n',
  );
}
