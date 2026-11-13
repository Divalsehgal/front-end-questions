// The content manifest: every subject, topic and question minus the question bodies. It is
// generated from the real question bank at build/dev time (scripts/generate-content.mjs writes
// it to src/generated/content-manifest.json), so it can never drift from the content. Full subjects load
// on demand, one chunk each (./loader).
import type { QuestionDates } from './dates';
import type { Subject, SubjectMeta } from './types';

/** `dates` (by "subject:id", from git: ./dates) adds published / modified to the questions it knows. */
export function toManifest(subjects: Subject[], dates: Record<string, QuestionDates> = {}): SubjectMeta[] {
  return subjects.map(({ topics, ...subject }) => ({
    ...subject,
    topics: topics.map(({ slug, title, questions }) => ({
      slug,
      title,
      questions: questions.map(({ id, title, kind, difficulty }) => ({
        id,
        title,
        kind,
        ...(difficulty && { difficulty }),
        ...dates[`${subject.slug}:${id}`],
      })),
    })),
  }));
}

/** "subject:id" keys that occur more than once (each would shadow the other's URL). */
export function duplicateKeys(subjects: SubjectMeta[]) {
  const keys = subjects.flatMap((s) => s.topics.flatMap((t) => t.questions.map((q) => `${s.slug}:${q.id}`)));
  return keys.filter((k, i) => keys.indexOf(k) !== i);
}
