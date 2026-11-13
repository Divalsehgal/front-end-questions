import type { KeyboardEvent } from 'react';

/**
 * Arrow / Home / End handling for a group with one tab stop (tablists, radio groups).
 * Returns the index to move to, or null if the key isn't a navigation key.
 */
export function rovingIndex(e: KeyboardEvent, current: number, count: number): number | null {
  const next: Record<string, number> = {
    ArrowRight: (current + 1) % count,
    ArrowDown: (current + 1) % count,
    ArrowLeft: (current - 1 + count) % count,
    ArrowUp: (current - 1 + count) % count,
    Home: 0,
    End: count - 1,
  };
  if (!(e.key in next) || count === 0) return null;
  e.preventDefault();
  return next[e.key];
}

/** From an item's key event, focuses the n-th sibling item (matching `role`) in the same group. */
export function focusItem(e: KeyboardEvent<HTMLElement>, role: string, index: number) {
  e.currentTarget.parentElement?.querySelectorAll<HTMLElement>(`:scope > [role="${role}"]`)[index]?.focus();
}
