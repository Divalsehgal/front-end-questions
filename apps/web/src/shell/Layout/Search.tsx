'use client';
import { ALL, hrefOf, type Entry } from '@fe-grind/content/registry';
import { cn } from '@fe-grind/ui/lib';
import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const LIMIT = 20;

/** Questions whose title, topic or subject contain every typed word, title matches first. */
export function searchQuestions(query: string, entries: Entry[] = ALL) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const hits = entries.filter((e) => {
    const text = `${e.q.title} ${e.topic.title} ${e.subject.title}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
  const inTitle = (e: Entry) => words.every((w) => e.q.title.toLowerCase().includes(w));
  return [...hits.filter(inTitle), ...hits.filter((e) => !inTitle(e))].slice(0, LIMIT);
}

/** Cmd/Ctrl+K opens it from anywhere, even while typing (it is the one shortcut people expect to work there). */
export function useSearchShortcut(open: () => void) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      if (e.target instanceof Element && e.target.closest('.monaco-editor')) return;
      e.preventDefault();
      open();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
}

/** A combobox over every question; Enter or a click opens the highlighted one. */
export function SearchDialog({ onClose }: Readonly<{ onClose: () => void }>) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchQuestions(query), [query]);
  const router = useRouter();
  const listId = useId();
  const returnFocus = useRef(document.activeElement);

  // Hand focus back to whatever opened the dialog.
  useEffect(() => () => (returnFocus.current as HTMLElement | null)?.focus?.(), []);

  const go = (e: Entry | undefined) => {
    if (!e) return;
    onClose();
    router.push(hrefOf(e.key));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    // The backdrop is a mouse convenience; Escape is the keyboard way out.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <dialog
        open
        aria-modal="true"
        aria-label="Search questions"
        className="relative m-0 w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface p-0 text-text-main shadow-xl focus-within:border-focus"
      >
        {/* The dialog's border is the focus indicator: the global outline would be clipped by overflow-hidden. */}
        <div className="flex items-center gap-2 px-4">
          <SearchIcon size={16} aria-hidden className="shrink-0 text-text-muted" />
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            role="combobox"
            aria-label="Search questions"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search questions…"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-text-main outline-none! placeholder:text-text-muted"
          />
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto border-t border-line p-2 empty:hidden">
          {results.map((e, i) => (
            // Arrow keys and Enter on the combobox drive the options; the click is for mice.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={e.key}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={() => go(e)}
              className={cn('cursor-pointer rounded-lg px-3 py-2 text-sm', i === active ? 'bg-brand-soft text-brand-strong' : 'text-text-main')}
            >
              <span className="block truncate font-medium">{e.q.title}</span>
              <span className="block truncate text-xs text-text-muted">
                {e.subject.title} · {e.topic.title}
              </span>
            </li>
          ))}
        </ul>
        {query.trim() && !results.length && <p className="border-t border-line px-4 py-3 text-sm text-text-muted">No questions match “{query.trim()}”.</p>}
      </dialog>
    </div>
  );
}
