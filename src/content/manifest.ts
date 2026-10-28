// The content manifest: every subject, topic and question minus the question bodies. It is
// generated from the real question bank at build/dev time (vite-plugins/content-manifest.ts serves
// it as `virtual:content-manifest`), so it can never drift from the content. Full subjects load
// on demand, one chunk each (./loader).
import type { Subject, SubjectMeta } from './types';

export function toManifest(subjects: Subject[]): SubjectMeta[] {
  return subjects.map(({ topics, ...subject }) => ({
    ...subject,
    topics: topics.map(({ slug, title, questions }) => ({
      slug,
      title,
      questions: questions.map(({ id, title, kind, difficulty }) => ({ id, title, kind, ...(difficulty && { difficulty }) })),
    })),
  }));
}

/** "subject:id" keys that occur more than once (each would shadow the other's URL). */
export function duplicateKeys(subjects: SubjectMeta[]) {
  const keys = subjects.flatMap((s) => s.topics.flatMap((t) => t.questions.map((q) => `${s.slug}:${q.id}`)));
  return keys.filter((k, i) => keys.indexOf(k) !== i);
}
