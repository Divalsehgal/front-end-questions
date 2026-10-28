import { Eye } from 'lucide-react';
import type { ReactNode, SyntheticEvent } from 'react';

export const DISCLOSURE_LABEL = 'Show answer & explanation';

/**
 * The answer and explanation as a native <details>: present in the prerendered HTML (so search
 * engines index it) but collapsed. Opening it is a reveal: `onOpen` decides whether that's allowed
 * (usually confirmReveal + a recorded miss) and returns false to snap it shut again.
 */
export function AnswerDisclosure({ onOpen, children, label = DISCLOSURE_LABEL }: Readonly<{ onOpen: () => boolean; children: ReactNode; label?: string }>) {
  const onToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
    const el = e.currentTarget;
    if (el.open && !onOpen()) el.open = false;
  };
  return (
    <details onToggle={onToggle} className="group rounded-lg border border-line bg-surface">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main">
        <Eye size={16} aria-hidden /> {label}
      </summary>
      <div className="space-y-3 border-t border-line px-4 py-4">{children}</div>
    </details>
  );
}
