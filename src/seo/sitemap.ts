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
 * commit; `fallback` (the build date) is used only when nothing else is known. Each question URL
 * gets its own git `modified` date, so one edit doesn't mark a whole subject as changed (Google
 * ignores lastmod on sites where it proves unreliable). The home page and each sitemap in the
 * index take the newest date they cover.
 */
export function buildSitemaps(lastmod: (subject: string) => string | undefined, fallback: string): Sitemaps {
  const newest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), '');
  const subjects = SUBJECTS.map((s) => {
    const subjectDate = lastmod(s.slug);
    const questions = ALL.filter((e) => e.subject.slug === s.slug).map((e) => ({ path: hrefOf(e.key), lastmod: e.q.modified ?? subjectDate ?? fallback }));
    const own = subjectDate ?? (newest(questions.map((q) => q.lastmod)) || fallback);
    return { name: s.slug, entries: [{ path: subjectHref(s.slug), lastmod: own }, ...questions] };
  });
  const home = newest(subjects.flatMap((g) => g.entries.map((e) => e.lastmod))) || fallback;
  const groups = [{ name: 'pages', entries: [{ path: '/', lastmod: home }] }, ...subjects];
  const files: Record<string, string> = {};
  for (const g of groups) files[sitemapFile(g.name)] = urlset(g.entries.map((e) => ({ loc: absoluteUrl(e.path), lastmod: e.lastmod })));
  files[SITEMAP_INDEX] = [
    XML_HEAD,
    `<sitemapindex ${NS}>`,
    ...groups.map(
      (g) => `  <sitemap><loc>${escapeHtml(SITE_URL + sitemapFile(g.name))}</loc><lastmod>${newest(g.entries.map((e) => e.lastmod))}</lastmod></sitemap>`,
    ),
    '</sitemapindex>',
    '',
  ].join('\n');
  return { files, urls: groups.flatMap((g) => g.entries.map((e) => absoluteUrl(e.path))) };
}

/** robots.txt: everything crawlable except the progress-only routes, plus the sitemap index. */
export function robotsTxt() {
  const base = new URL(SITE_URL).pathname;
  return ['User-agent: *', 'Allow: /', ...NOINDEX_ROUTES.map((r) => `Disallow: ${base}${r.slice(1)}`), '', `Sitemap: ${SITE_URL}${SITEMAP_INDEX}`, ''].join(
    '\n',
  );
}
