import { cn } from '../lib';
import type { Attempt } from '../../state/progress';

const STATES = {
  none: { cls: 'border border-line-strong bg-surface', label: 'Not attempted' },
  correct: { cls: 'bg-success', label: 'Solved' },
  wrong: { cls: 'bg-error', label: 'Needs review' },
} as const;

export function StatusDot({ attempt }: Readonly<{ attempt?: Attempt }>) {
  const s = STATES[attempt?.status ?? 'none'];
  // The dot is decoration with a tooltip; its meaning is real (visually hidden) text, so it reads inside links too.
  return (
    <span className={cn('inline-block size-2.5 shrink-0 rounded-full', s.cls)} title={s.label}>
      <span className="sr-only">{s.label}</span>
    </span>
  );
}
