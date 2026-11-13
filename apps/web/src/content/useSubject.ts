'use client';
// React bindings for ./loader (kept apart so server components can import the loader).
import { fullEntry, loadedSubject, loadSubject, SUBJECT_CHUNKS, subscribe } from '@fe-grind/content/loader';
import { useHydrated } from '@fe-grind/ui/lib/useHydrated';
import { use, useEffect, useSyncExternalStore } from 'react';

/**
 * The full subject, loading it if needed; undefined while it loads (or for an unknown slug).
 * On the server and while hydrating it suspends instead, so the prerendered HTML carries the
 * full question and the first client render matches it.
 */
export function useSubject(slug: string | undefined) {
  const hydrated = useHydrated();
  const read = () => (slug ? loadedSubject(slug) : undefined);
  const subject = useSyncExternalStore(subscribe, read, read);
  // Known subjects only: an unknown slug would resolve to nothing and suspend again forever.
  if (slug && !subject && !hydrated && Object.hasOwn(SUBJECT_CHUNKS, slug)) use(loadSubject(slug));
  useEffect(() => {
    if (slug && !subject) loadSubject(slug).catch((err: unknown) => console.error(`Could not load subject "${slug}"`, err));
  }, [slug, subject]);
  return subject;
}

/** The full entry for a "subject:id" key, loading its subject if needed. */
export function useFullEntry(key: string) {
  useSubject(key.split(':')[0]);
  return fullEntry(key);
}
