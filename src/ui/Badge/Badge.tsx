import { cn, TONES, type Tone } from '../lib';
import type { Difficulty } from '../../content/types';
import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = TONES[tone];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap', t.bg, t.text, className)}>
      {children}
    </span>
  );
}

export const DIFFICULTY_TONE: Record<Difficulty, Tone> = { easy: 'success', medium: 'warn', hard: 'error' };

export function DifficultyBadge({ difficulty }: { difficulty?: Difficulty }) {
  if (!difficulty) return null;
  return (
    <Badge tone={DIFFICULTY_TONE[difficulty]} className="capitalize">
      <span className="sr-only">Difficulty: </span>
      {difficulty}
    </Badge>
  );
}
