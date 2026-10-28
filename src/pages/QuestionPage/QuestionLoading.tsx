import { Loader2 } from 'lucide-react';

/** Shown for the moment a question's subject chunk is loading after client-side navigation. */
export function QuestionLoading() {
  return (
    <output className="flex min-h-64 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm text-text-muted">
      <Loader2 size={16} aria-hidden className="animate-spin" /> Loading question…
    </output>
  );
}
