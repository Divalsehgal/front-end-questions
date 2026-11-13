// Subject-page FAQ, built from the registry so its numbers and topics never drift. SubjectPage shows
// it and subjectJsonLd marks the same text up as FAQPage (Google requires the FAQ to be visible).
import { KIND_META, KIND_ORDER } from '../questions/kinds';
import { stripMarkdown } from './text';
import type { QuestionMeta, SubjectMeta } from '@fe-grind/content/types';

export type Faq = { q: string; a: string };

/** "React (with hooks)" -> "React": the name people search for. */
export const shortSubject = (s: SubjectMeta) => s.title.split(/[,:&(]/)[0].trim();

const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

/** Question count per kind, e.g. "Quizzes (12), Flashcards (8)". */
export function kindSummary(questions: QuestionMeta[]) {
  return KIND_ORDER.flatMap((k) => {
    const n = questions.filter((q) => q.kind === k).length;
    return n ? [`${KIND_META[k].plural} (${n})`] : [];
  }).join(', ');
}

/** The paragraph under a subject page's title. */
export function subjectIntro(s: SubjectMeta) {
  const count = s.topics.reduce((n, t) => n + t.questions.length, 0);
  return `Practise ${shortSubject(s)} for frontend interviews with ${count} free questions in ${s.topics.length} topics. Every question shows its answer and an explanation once you have tried it.`;
}

export function subjectFaq(s: SubjectMeta): Faq[] {
  const name = shortSubject(s);
  const count = s.topics.reduce((n, t) => n + t.questions.length, 0);
  return [
    {
      q: `How many ${name} interview questions are there?`,
      a: `${count} questions in ${s.topics.length} topics: ${kindSummary(s.topics.flatMap((t) => t.questions))}. All of them are free and need no login.`,
    },
    { q: `What do the ${name} questions cover?`, a: `${list(s.topics.map((t) => stripMarkdown(t.title)))}.` },
    {
      q: `How should I practise ${name} for a frontend interview?`,
      a: 'Go topic by topic and answer each question before you open its answer and explanation. Progress stays in your browser, so Review brings back the questions you missed, and a mock round mixes questions under a timer.',
    },
  ];
}
