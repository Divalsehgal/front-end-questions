// schema.org JSON-LD builders. Every answer/explanation here is also in the page's HTML
// (the "Show answer & explanation" disclosure), as Google requires for structured data.
import { ALL, getEntry, hrefOf, subjectHref, type FullEntry } from '@fe-grind/content/registry';
import { SITE_FAQ, subjectFaq, type Faq } from './faq';
import { AUTHOR, AUTHOR_PROFILES, REPO_URL, SITE_ALT_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { stripMarkdown } from './text';
import type { Difficulty, SubjectMeta } from '@fe-grind/content/types';

const CONTEXT = 'https://schema.org';
const author = { '@type': 'Person', name: AUTHOR, url: AUTHOR_PROFILES[0], sameAs: AUTHOR_PROFILES };
const LEVEL: Record<Difficulty, string> = { easy: 'Beginner', medium: 'Intermediate', hard: 'Advanced' };

export const questionCount = (s: SubjectMeta) => s.topics.reduce((n, t) => n + t.questions.length, 0);

const ORG_ID = `${SITE_URL}#organization`;
const WEBSITE_ID = `${SITE_URL}#website`;

/** The site as an entity: what answer engines tie the brand name, logo and profiles to. */
function organization() {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: SITE_URL,
    logo: SITE_URL + 'icon-512.png',
    description: SITE_DESCRIPTION,
    founder: author,
    sameAs: [REPO_URL, ...AUTHOR_PROFILES],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: `${REPO_URL}/issues`, availableLanguage: 'en' },
  };
}

const newest = (dates: (string | undefined)[]) => dates.reduce<string | undefined>((a, b) => (b && (!a || b > a) ? b : a), undefined);
const oldest = (dates: (string | undefined)[]) => dates.reduce<string | undefined>((a, b) => (b && (!a || b < a) ? b : a), undefined);

/** First publish and latest edit across every question (git dates from the manifest). */
export function siteDates() {
  return { published: oldest(ALL.map((e) => e.q.published)), modified: newest(ALL.map((e) => e.q.modified)) };
}

const faqPage = (faq: Faq[]) => ({
  '@context': CONTEXT,
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function webPage(type: 'WebPage' | 'AboutPage', url: string, name: string) {
  const { published, modified } = siteDates();
  return {
    '@context': CONTEXT,
    '@type': type,
    url,
    name,
    inLanguage: 'en',
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}

export function homeJsonLd() {
  return [
    {
      '@context': CONTEXT,
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      alternateName: SITE_ALT_NAMES,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      author,
      publisher: { '@id': ORG_ID },
      isAccessibleForFree: true,
      sameAs: [REPO_URL],
    },
    organization(),
    webPage('WebPage', SITE_URL, SITE_NAME),
  ];
}

/** /about: the page, the entity it describes, and the FAQ it shows. */
export function aboutJsonLd(url: string) {
  return [breadcrumbs([homeCrumb(), { name: 'About', url }]), webPage('AboutPage', url, `About ${SITE_NAME}`), organization(), faqPage(SITE_FAQ)];
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

const homeCrumb = () => ({ name: SITE_NAME, url: SITE_URL });
const subjectCrumb = (s: SubjectMeta) => ({ name: s.title, url: absoluteUrl(subjectHref(s.slug)) });

export function subjectJsonLd(s: SubjectMeta) {
  const questions = s.topics.flatMap((t) => t.questions);
  return [
    breadcrumbs([homeCrumb(), subjectCrumb(s)]),
    {
      '@context': CONTEXT,
      '@type': 'ItemList',
      name: `${s.title} interview questions`,
      numberOfItems: questionCount(s),
      itemListElement: questions.map((q, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: stripMarkdown(q.title),
        url: absoluteUrl(hrefOf(`${s.slug}:${q.id}`)),
      })),
    },
    faqPage(subjectFaq(s)),
  ];
}

/** The question an output-kind page asks. */
export const outputLead = (lang?: string) => `What does this ${lang === 'ts' ? 'TypeScript' : 'JavaScript'} code log?`;

/** The visible text a question leads with (what a searcher would type). Never the answer or explanation. */
export function questionLead(e: FullEntry) {
  const q = e.q;
  switch (q.kind) {
    case 'flashcard':
      return q.front;
    case 'output':
      return `${outputLead(q.lang)} ${q.title}`;
    default:
      return q.prompt;
  }
}

const answer = (text: string, position?: number, explanation?: string) => ({
  '@type': 'Answer',
  text: stripMarkdown(text),
  ...(position !== undefined && { position }),
  ...(explanation && { answerExplanation: { '@type': 'Comment', text: stripMarkdown(explanation) } }),
});

/** The single Question inside a Quiz: multiple choice (or checkbox) for quizzes, recall for flashcards. */
function questionPart(e: FullEntry) {
  const q = e.q;
  if (q.kind === 'quiz') {
    const correct = new Set(Array.isArray(q.answer) ? q.answer : [q.answer]);
    const accepted = q.options.flatMap((o, i) => (correct.has(i) ? [answer(o, i, q.why)] : []));
    return {
      '@type': 'Question',
      eduQuestionType: correct.size > 1 ? 'Checkbox' : 'Multiple choice',
      learningResourceType: 'Practice problem',
      name: stripMarkdown(q.title),
      text: stripMarkdown(q.prompt),
      suggestedAnswer: q.options.flatMap((o, i) => (correct.has(i) ? [] : [answer(o, i)])),
      acceptedAnswer: accepted.length === 1 ? accepted[0] : accepted,
    };
  }
  if (q.kind === 'flashcard') {
    return { '@type': 'Question', eduQuestionType: 'Flashcard', name: stripMarkdown(q.title), text: stripMarkdown(q.front), acceptedAnswer: answer(q.back) };
  }
  if (q.kind === 'order') {
    // The correct order as a numbered list: the same steps and explanation the page reveals.
    const steps = q.items.map((item, i) => `Step ${i + 1}: ${stripMarkdown(item)}`).join(' ');
    return {
      '@type': 'Question',
      eduQuestionType: 'Ordering',
      name: stripMarkdown(q.title),
      text: stripMarkdown(q.prompt),
      acceptedAnswer: answer(steps, undefined, q.why),
    };
  }
  return null;
}

const RESOURCE_TYPE = {
  quiz: 'Quiz',
  flashcard: 'Flashcard',
  output: 'Code output prediction',
  code: 'Coding exercise',
  ui: 'Machine coding exercise',
  order: 'Ordering exercise',
};

export function questionJsonLd(e: FullEntry) {
  const url = absoluteUrl(hrefOf(e.key));
  const part = questionPart(e);
  // Dates live in the manifest (from git at build time), not in the full question.
  const { published, modified } = getEntry(e.key)?.q ?? {};
  const resource = {
    '@context': CONTEXT,
    '@type': part ? 'Quiz' : 'LearningResource',
    name: stripMarkdown(e.q.title),
    description: stripMarkdown(questionLead(e)),
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: RESOURCE_TYPE[e.q.kind],
    educationalLevel: LEVEL[e.q.difficulty ?? 'medium'],
    about: { '@type': 'Thing', name: e.subject.title },
    keywords: [e.subject.title, stripMarkdown(e.topic.title), 'frontend interview question'].join(', '),
    author,
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    ...(part && { hasPart: [part] }),
  };
  return [breadcrumbs([homeCrumb(), subjectCrumb(e.subject), { name: stripMarkdown(e.q.title), url }]), resource];
}

/** JSON for a <script type="application/ld+json">: "<" is escaped so "</script>" (or "<!--") in content can't end the tag. */
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data)
    .replaceAll('<', String.raw`\u003c`)
    .replaceAll('>', String.raw`\u003e`)
    .replaceAll('&', String.raw`\u0026`)
    .replaceAll('\u2028', String.raw`\u2028`)
    .replaceAll('\u2029', String.raw`\u2029`);
