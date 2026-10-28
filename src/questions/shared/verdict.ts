import { useRef } from 'react';
import type { Question } from '../../content/types';

export type ViewProps<Q extends Question> = { q: Q; subject: string; onResult: (correct: boolean) => void };

/**
 * Only the first verdict per visit counts, so retrying after seeing the answer
 * can't turn a miss into a pass. Returns a function that reports once.
 */
export function useFirstVerdict(onResult: (correct: boolean) => void) {
  const done = useRef(false);
  return (correct: boolean) => {
    if (done.current) return;
    done.current = true;
    onResult(correct);
  };
}

export const REVEAL_CONFIRM = 'Reveal the reference solution? It will count as a miss and come back in Review.';

/** Asks before revealing a solution; returns false if the user backs out. Already-solved questions skip the prompt. */
export const confirmReveal = (solved: boolean) => solved || window.confirm(REVEAL_CONFIRM);
