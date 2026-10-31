import { fullEntry } from '../content/loader';
import { getSubject, keyOf, type FullEntry } from '../content/registry';
import { homeJsonLd, questionJsonLd, questionLead, subjectJsonLd } from './jsonld';
import { absoluteUrl, isNoindex, normalizePath, SITE_ALT_NAMES, SITE_DESCRIPTION, SITE_NAME } from './site';
import { fitFirst, stripMarkdown, truncate } from './text';
import type { SubjectMeta } from '../content/types';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export type PageMeta = {
  title: string;
  description: string;
  /** Absolute canonical URL; null for pages that should not be indexed. */
  canonical: string | null;
  noindex: boolean;
  ogType: 'website' | 'article';
  jsonLd: object[];
};

const SUFFIX = ` | ${SITE_NAME}`;

/** "{main} — {qualifier}{suffix}", dropping parts (then truncating main) until it fits in 60 characters. */
export function pageTitle(main: string, qualifiers: string[]) {
  const plain = stripMarkdown(main);
  const options = [...qualifiers.map((q) => `${plain} — ${q}${SUFFIX}`), `${plain}${SUFFIX}`];
  const fit = options.find((o) => o.length <= TITLE_MAX);
  return fit ?? `${truncate(plain, TITLE_MAX - SUFFIX.length)}${SUFFIX}`;
}

export const metaDescription = (...parts: string[]) => truncate(stripMarkdown(parts.filter(Boolean).join(' ')), DESCRIPTION_MAX);

/** The question's own words first; short ones get context so the snippet still says what the page is. */
function questionDescription(e: FullEntry, subject: string) {
  const lead = stripMarkdown(questionLead(e));
  const context = `${stripMarkdown(e.q.title)}: a free ${subject} interview question on ${stripMarkdown(e.topic.title)}, with answer and explanation.`;
  return metaDescription(lead, lead.length < 100 ? context : '');
}

const shortSubject = (s: SubjectMeta) => s.title.split(/[,:&(]/)[0].trim();

function questionMeta(e: FullEntry, path: string): PageMeta {
  const subject = shortSubject(e.subject);
  return {
    title: pageTitle(e.q.title, [`${subject} interview question`, subject]),
    description: questionDescription(e, subject),
    canonical: absoluteUrl(path),
    noindex: false,
    ogType: 'article',
    jsonLd: questionJsonLd(e),
  };
}

function subjectMeta(s: SubjectMeta, path: string): PageMeta {
  const count = s.topics.reduce((n, t) => n + t.questions.length, 0);
  return {
    title: fitFirst([`${s.title} interview questions & practice${SUFFIX}`, `${shortSubject(s)} interview questions${SUFFIX}`], TITLE_MAX),
    description: metaDescription(`${count} free ${shortSubject(s)} interview questions with answers and explanations.`, s.blurb),
    canonical: absoluteUrl(path),
    noindex: false,
    ogType: 'website',
    jsonLd: subjectJsonLd(s),
  };
}

const HOME: PageMeta = {
  title: `${SITE_ALT_NAMES[0]} (${SITE_NAME}): free frontend interview practice`,
  description: truncate(SITE_DESCRIPTION, DESCRIPTION_MAX),
  canonical: absoluteUrl('/'),
  noindex: false,
  ogType: 'website',
  jsonLd: homeJsonLd(),
};

const NOINDEX_TITLES: Record<string, string> = {
  review: 'Review',
  mock: 'Mock round',
  session: 'Session summary',
  settings: 'Settings',
  architecture: 'Architecture',
  verify: 'Verify content',
};

/** Everything <head> needs for a router path (without the deploy base). Unknown paths get the home meta, noindexed. */
export function pageMeta(pathname: string): PageMeta {
  const path = normalizePath(pathname);
  const [section, a, b] = path.split('/').filter(Boolean);
  if (!section) return HOME;
  if (section === 'q' && a && b && !path.split('/')[4]) {
    // Question pages need their subject loaded (see Seo and src/content/loader.ts).
    const entry = fullEntry(keyOf(a, b));
    if (entry) return questionMeta(entry, path);
  }
  if (section === 's' && a && !b) {
    const subject = getSubject(a);
    if (subject) return subjectMeta(subject, path);
  }
  const title = isNoindex(path) ? `${NOINDEX_TITLES[section]}${SUFFIX}` : `Page not found${SUFFIX}`;
  return { ...HOME, title, canonical: null, noindex: true, jsonLd: [] };
}
