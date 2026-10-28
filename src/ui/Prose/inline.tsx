import { Fragment, type ReactNode } from 'react';
import { withStableKeys } from '../lib/stableKeys';

/** Inline markdown-lite: `code` and **bold**. Everything else is plain text. */
export function inline(text: string): ReactNode[] {
  return withStableKeys(text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)).map(({ item: part, key }) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1)
      return (
        <code key={key} className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={key}>{part.slice(2, -2)}</strong>;
    return <Fragment key={key}>{part}</Fragment>;
  });
}
