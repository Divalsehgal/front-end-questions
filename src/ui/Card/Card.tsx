import { cn } from '../lib';
import type { ReactNode } from 'react';

export function Card({ children, className, interactive }: Readonly<{ children: ReactNode; className?: string; interactive?: boolean }>) {
  return (
    <div className={cn('rounded-xl border border-line bg-surface', interactive && 'transition-colors group-hover:border-brand hover:border-brand', className)}>
      {children}
    </div>
  );
}

/** A list inside a Card, with dividers between rows. */
export function List({ children, label }: Readonly<{ children: ReactNode; label?: string }>) {
  return (
    <ul className="divide-y divide-line" aria-label={label}>
      {children}
    </ul>
  );
}
