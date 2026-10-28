// schema.org JSON-LD builders. Every answer/explanation here is also in the page's HTML
// (the "Show answer & explanation" disclosure), as Google requires for structured data.
import { hrefOf, subjectHref, type FullEntry } from '../content/registry';
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { stripMarkdown } from './text';
import type { Difficulty, SubjectMeta } from '../content/types';

const CONTEXT = 'https://schema.org';
const author = { '@type': 'Person', name: AUTHOR };
const LEVEL: Record<Difficulty, string> = { easy: 'Beginner', medium: 'Intermediate', hard: 'Advanced' };

const questionCount = (s: SubjectMeta) => s.topics.reduce((n, t) => n + t.questions.length, 0);

export function homeJsonLd() {
  return [
    {
      '@context': CONTEXT,
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      author,
    },
  ];
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
  ];
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
  const resource = {
    '@context': CONTEXT,
    '@type': part ? 'Quiz' : 'LearningResource',
    name: stripMarkdown(e.q.title),
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: RESOURCE_TYPE[e.q.kind],
    educationalLevel: LEVEL[e.q.difficulty ?? 'medium'],
    about: { '@type': 'Thing', name: e.subject.title },
    keywords: [e.subject.title, stripMarkdown(e.topic.title), 'frontend interview question'].join(', '),
    author,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    ...(part && { hasPart: [part] }),
  };
  return [breadcrumbs([homeCrumb(), subjectCrumb(e.subject), { name: stripMarkdown(e.q.title), url }]), resource];
}

/** JSON for a <script type="application/ld+json">: "<" is escaped so "</script>" (or "<!--") in content can't end the tag. */
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
