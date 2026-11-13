import { Circle, CircleCheck, CircleX } from 'lucide-react';
import { cn } from '../lib';

const STATES = {
  none: { Icon: Circle, cls: 'text-line-strong', label: 'Not attempted' },
  correct: { Icon: CircleCheck, cls: 'text-success', label: 'Solved' },
  wrong: { Icon: CircleX, cls: 'text-error', label: 'Needs review' },
} as const;

/** The only part of a progress record the dot reads (the app's Attempt satisfies it). */
export type DotAttempt = { status: 'correct' | 'wrong' };

/** Progress for one question: an empty ring, a check or a cross. `withLabel` also shows the words. */
export function StatusDot({ attempt, withLabel = false }: Readonly<{ attempt?: DotAttempt; withLabel?: boolean }>) {
  const s = STATES[attempt?.status ?? 'none'];
  // The icon is decoration with a tooltip; its meaning is real text (visually hidden unless
  // withLabel), so it reads inside links too.
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 text-xs font-medium', s.cls)} title={withLabel ? undefined : s.label}>
      <s.Icon size={16} aria-hidden />
      <span className={withLabel ? 'text-text-muted' : 'sr-only'}>{s.label}</span>
    </span>
  );
}
