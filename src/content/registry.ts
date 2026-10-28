// Everything every page needs about the question bank, from the light manifest: subjects, topics,
// and each question's id/title/kind/difficulty. Question bodies live in per-subject chunks that
// ./loader fetches on demand (only question pages need them).
import MANIFEST from 'virtual:content-manifest';
import type { Kind, Subject, SubjectMeta } from './types';

type EntryOf<S extends SubjectMeta> = {
  key: string;
  subject: S;
  topic: S['topics'][number];
  q: S['topics'][number]['questions'][number];
};
/** A question in context, from the manifest: enough for lists, counts, links and progress. */
export type Entry = EntryOf<SubjectMeta>;
/** The same with the full question (prompt, options, code, tests…): see ./loader. */
export type FullEntry = EntryOf<Subject>;

export const keyOf = (subject: string, id: string) => `${subject}:${id}`;
// Trailing slashes match the prerendered dist/<path>/index.html files, so links never hit a redirect.
export const hrefOf = (key: string) => `/q/${key.replace(':', '/')}/`;
export const subjectHref = (slug: string) => `/s/${slug}/`;

export const entriesFrom = <S extends SubjectMeta>(subjects: S[]): EntryOf<S>[] =>
  subjects.flatMap((subject) =>
    (subject.topics as S['topics'][number][]).flatMap((topic) =>
      (topic.questions as S['topics'][number]['questions'][number][]).map((q) => ({ key: keyOf(subject.slug, q.id), subject, topic, q })),
    ),
  );

// Order is the order on the dashboard and in the sidebar (src/content/subjects/index.ts).
export const SUBJECTS: SubjectMeta[] = MANIFEST;
export const ALL: Entry[] = entriesFrom(SUBJECTS);

const byKey = new Map(ALL.map((e) => [e.key, e]));
export const getEntry = (key: string) => byKey.get(key);
export const getSubject = (slug: string) => SUBJECTS.find((s) => s.slug === slug);
export const entriesOf = (subject: string, kind?: Kind) => ALL.filter((e) => e.subject.slug === subject && (!kind || e.q.kind === kind));
