import { cn } from '../lib';
import type { ReactNode } from 'react';

/** Header strip for a result card (e.g. "3 / 5 tests passed"); announced politely when it appears. */
export function ResultHeader({ ok, children, icon }: { ok: boolean; children: ReactNode; icon?: ReactNode }) {
  return (
    <div
      role="status"
      className={cn('flex items-center gap-2 px-4 py-3 text-sm font-semibold', ok ? 'bg-success-soft text-success' : 'bg-error-soft text-error')}
    >
      {icon}
      {children}
    </div>
  );
}
