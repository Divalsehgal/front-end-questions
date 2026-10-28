import { Check, Lightbulb, X } from 'lucide-react';
import { useMemo } from 'react';
import { Callout, inline, useHydrated } from '../../ui';
import { Prose } from '../../ui/code';
import { AnswerDisclosure, shuffle } from '../shared';
import type { QuizQuestion } from '../../content/types';

/**
 * The correct option indexes plus the options to show. Shuffled once per visit so you learn the
 * answer, not its position; prerendered HTML (and the hydration pass) keeps the authored order
 * so server and client markup match.
 */
export function useQuizOptions(q: QuizQuestion) {
  const correct = useMemo(() => new Set(Array.isArray(q.answer) ? q.answer : [q.answer]), [q]);
  const hydrated = useHydrated();
  const options = useMemo(() => {
    const all = q.options.map((text, i) => ({ text, correct: correct.has(i) }));
    return hydrated ? shuffle(all) : all;
  }, [q, correct, hydrated]);
  return { correct, options };
}

export function resultTitle(isRight: boolean, revealed: boolean, multi: boolean) {
  if (isRight) return 'Correct';
  if (revealed) return `Answer revealed: the green ${multi ? 'ones are' : 'one is'} right`;
  return multi ? 'Not quite: the green ones are right' : 'Not this one';
}

/** The correct option(s) and explanation, in the page but collapsed until revealed. */
export function QuizAnswer({ q, correct, onOpen }: { q: QuizQuestion; correct: Set<number>; onOpen: () => boolean }) {
  return (
    <AnswerDisclosure onOpen={onOpen}>
      <p className="font-medium">{correct.size > 1 ? 'Correct answers:' : 'Correct answer:'}</p>
      <ul className="list-disc space-y-1 pl-5">{q.options.flatMap((o, i) => (correct.has(i) ? [<li key={o}>{inline(o)}</li>] : []))}</ul>
      <Prose text={q.why} />
    </AnswerDisclosure>
  );
}

/** The verdict plus the explanation, announced when it appears. */
export function QuizResult({ why, isRight, title }: { why: string; isRight: boolean; title: string }) {
  return (
    <Callout role="status" tone={isRight ? 'success' : 'error'} title={title} icon={isRight ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}>
      <div className="flex gap-2">
        <Lightbulb size={16} aria-hidden className="mt-1.5 shrink-0 text-brand-strong" />
        <Prose text={why} className="min-w-0 flex-1" />
      </div>
    </Callout>
  );
}
