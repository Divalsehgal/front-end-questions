// Full subjects (question bodies and code fixtures), one lazily loaded chunk per subject, so a page
// downloads only the subject it shows. Reads are synchronous once loaded; ./useSubject suspends
// the server render and hydration until the subject is in, so the HTML always has the full question.
// Server routes and tests seed everything up front via ./bank.
import { entriesFrom, getSubject, SUBJECTS, type FullEntry } from './registry';
import type { Subject } from './types';

// One chunk per subject (keep in step with ./subjects/index.ts: loader.test.tsx checks).
export const SUBJECT_CHUNKS: Record<string, () => Promise<Record<string, unknown>>> = {
  css: () => import('./subjects/css'),
  dsa: () => import('./subjects/dsa'),
  html: () => import('./subjects/html'),
  javascript: () => import('./subjects/javascript'),
  'machine-coding': () => import('./subjects/machine-coding'),
  nextjs: () => import('./subjects/nextjs'),
  nodejs: () => import('./subjects/nodejs'),
  patterns: () => import('./subjects/patterns'),
  react: () => import('./subjects/react'),
  security: () => import('./subjects/security'),
  'system-design': () => import('./subjects/system-design'),
  testing: () => import('./subjects/testing'),
  typescript: () => import('./subjects/typescript'),
};
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
  const chunk = Object.hasOwn(SUBJECT_CHUNKS, slug) ? SUBJECT_CHUNKS[slug] : undefined;
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

/** Re-renders `listener` whenever a subject arrives (./useSubject). */
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
