// Full subjects (question bodies and code fixtures), one lazily loaded chunk per subject, so a page
// downloads only the subject it shows. Reads are synchronous once loaded: main.tsx awaits
// preloadPath() before hydrating, so the first client render matches the prerendered HTML, and the
// prerender/tests seed everything up front via ./bank.
import { useEffect, useSyncExternalStore } from 'react';
import { entriesFrom, getSubject, SUBJECTS, type FullEntry } from './registry';
import type { Subject } from './types';

const chunks = import.meta.glob<Record<string, unknown>>('./subjects/*/index.ts');
const loaded = new Map<string, Subject>();
const byKey = new Map<string, FullEntry>();
const inflight = new Map<string, Promise<Subject | undefined>>();
const listeners = new Set<() => void>();

const isSubject =
  (slug: string) =>
  (v: unknown): v is Subject =>
    typeof v === 'object' && v !== null && (v as Subject).slug === slug && Array.isArray((v as Subject).topics);

/** Makes subjects available synchronously (prerender, tests, and each chunk as it arrives). */
export function provideSubjects(subjects: Subject[]) {
  for (const s of subjects) {
    loaded.set(s.slug, s);
    for (const e of entriesFrom([s])) byKey.set(e.key, e);
  }
  listeners.forEach((l) => l());
}

export const loadedSubject = (slug: string) => loaded.get(slug);
/** The full entry for a key, or undefined until its subject has loaded. */
export const fullEntry = (key: string) => byKey.get(key);

export function loadSubject(slug: string): Promise<Subject | undefined> {
  const hit = loaded.get(slug);
  if (hit) return Promise.resolve(hit);
  const chunk = chunks[`./subjects/${slug}/index.ts`];
  if (!chunk) return Promise.resolve(undefined);
  let pending = inflight.get(slug);
  if (!pending) {
    pending = chunk()
      .then((mod) => {
        const subject = Object.values(mod).find(isSubject(slug));
        if (subject) provideSubjects([subject]);
        return subject;
      })
      .finally(() => inflight.delete(slug));
    inflight.set(slug, pending);
  }
  return pending;
}

export const loadAllSubjects = () => Promise.all(SUBJECTS.map((s) => loadSubject(s.slug)));

/** The subject a router path (without the deploy base) needs in full: question pages only. */
export function subjectForPath(pathname: string) {
  const slug = /^\/q\/([^/]+)\/[^/]+\/?$/.exec(pathname)?.[1];
  return slug && getSubject(slug) ? slug : undefined;
}

/** Source module of a subject's chunk, for the prerender's <link rel="modulepreload">. */
export const subjectModule = (slug: string) => `src/content/subjects/${slug}/index.ts`;

export const preloadPath = (pathname: string) => {
  const slug = subjectForPath(pathname);
  return slug ? loadSubject(slug) : Promise.resolve(undefined);
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The full subject, loading it if needed; undefined while it loads (or for an unknown slug). */
export function useSubject(slug: string | undefined) {
  const read = () => (slug ? loaded.get(slug) : undefined);
  const subject = useSyncExternalStore(subscribe, read, read);
  useEffect(() => {
    if (slug && !subject) loadSubject(slug).catch((err: unknown) => console.error(`Could not load subject "${slug}"`, err));
  }, [slug, subject]);
  return subject;
}

/** The full entry for a "subject:id" key, loading its subject if needed. */
export function useFullEntry(key: string) {
  useSubject(key.split(':')[0]);
  return byKey.get(key);
}
