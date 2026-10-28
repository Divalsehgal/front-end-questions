// Lookups plus structural invariants of the whole question bank. Per-kind content checks
// (quiz options/answers/why, order items, flashcard sides, UI compiles) live in content.test.ts.
import { describe, expect, it } from 'vitest';
import { BANK, BANK_ENTRIES } from './bank';
import { toManifest } from './manifest';
import { ALL, entriesOf, getEntry, getSubject, hrefOf, keyOf, subjectHref, SUBJECTS } from './registry';
import type { QuizQuestion } from './types';

const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe('keys and hrefs', () => {
  it('builds keys and hrefs', () => {
    expect(keyOf('javascript', 'closures-1')).toBe('javascript:closures-1');
    expect(hrefOf('javascript:closures-1')).toBe('/q/javascript/closures-1/');
  });

  it('builds subject hrefs', () => {
    expect(subjectHref('react')).toBe('/s/react/');
  });

  it('only replaces the first colon in an href', () => {
    expect(hrefOf('a:b:c')).toBe('/q/a/b:c/');
  });
});

describe('lookups', () => {
  const first = ALL[0];

  it('finds an entry by key, with its subject and topic', () => {
    const e = getEntry(first.key)!;
    expect(e).toBe(first);
    expect(e.subject.topics).toContain(e.topic);
    expect(e.topic.questions).toContain(e.q);
    expect(e.key).toBe(keyOf(e.subject.slug, e.q.id));
  });

  it('returns undefined for unknown keys and slugs', () => {
    expect(getEntry('nope:nope')).toBeUndefined();
    expect(getEntry('')).toBeUndefined();
    expect(getSubject('nope')).toBeUndefined();
  });

  it('finds every subject by slug', () => {
    for (const s of SUBJECTS) expect(getSubject(s.slug)).toBe(s);
  });

  it('lists a subject’s entries, optionally filtered by kind', () => {
    const slug = first.subject.slug;
    const all = entriesOf(slug);
    expect(all.length).toBe(first.subject.topics.reduce((n, t) => n + t.questions.length, 0));
    expect(all.every((e) => e.subject.slug === slug)).toBe(true);
    const quizzes = entriesOf(slug, 'quiz');
    expect(quizzes.every((e) => e.q.kind === 'quiz')).toBe(true);
    expect(quizzes.length).toBe(all.filter((e) => e.q.kind === 'quiz').length);
    expect(entriesOf('nope')).toEqual([]);
  });

  it('the manifest is the full question bank minus question bodies, in the same order', () => {
    expect(SUBJECTS).toEqual(toManifest(BANK));
    expect(ALL.map((e) => e.key)).toEqual(BANK_ENTRIES.map((e) => e.key));
    expect(ALL[0].q).toEqual({
      id: BANK_ENTRIES[0].q.id,
      title: BANK_ENTRIES[0].q.title,
      kind: BANK_ENTRIES[0].q.kind,
      difficulty: BANK_ENTRIES[0].q.difficulty,
    });
    expect(ALL.find((e) => e.q.kind === 'quiz')?.q).not.toHaveProperty('prompt');
  });

  it('ALL contains every question exactly once, in subject/topic order', () => {
    const flat = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.questions));
    expect(ALL.map((e) => e.q)).toEqual(flat);
  });
});

describe('question bank structure', () => {
  it('subject slugs are unique and every subject is filled in', () => {
    expect(dupes(SUBJECTS.map((s) => s.slug))).toEqual([]);
    for (const s of SUBJECTS) {
      expect(s.slug, s.slug).toMatch(/^[a-z0-9-]+$/);
      for (const field of [s.title, s.blurb, s.icon]) expect(field.trim(), s.slug).not.toBe('');
      expect(s.topics.length, `${s.slug} has topics`).toBeGreaterThan(0);
    }
  });

  it('topic slugs are unique within a subject and every topic has questions', () => {
    for (const s of SUBJECTS) {
      expect(dupes(s.topics.map((t) => t.slug)), s.slug).toEqual([]);
      for (const t of s.topics) {
        expect(t.title.trim(), `${s.slug}/${t.slug}`).not.toBe('');
        expect(t.questions.length, `${s.slug}/${t.slug} has questions`).toBeGreaterThan(0);
      }
    }
  });

  it('question ids are unique within each subject and URL-safe', () => {
    for (const s of SUBJECTS) {
      const ids = s.topics.flatMap((t) => t.questions.map((q) => q.id));
      expect(dupes(ids), s.slug).toEqual([]);
      for (const id of ids) expect(id, `${s.slug}:${id}`).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it('every question has a title', () => {
    for (const e of ALL) expect(e.q.title.trim(), e.key).not.toBe('');
  });

  it('quiz answers are integer indexes in range, with no repeats or empty answer lists', () => {
    const quizzes = BANK_ENTRIES.filter((e) => e.q.kind === 'quiz') as { key: string; q: QuizQuestion }[];
    expect(quizzes.length).toBeGreaterThan(0);
    for (const { key, q } of quizzes) {
      const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
      expect(answers.length, key).toBeGreaterThan(0);
      expect(new Set(answers).size, key).toBe(answers.length);
      for (const a of answers) expect(Number.isInteger(a) && a >= 0 && a < q.options.length, `${key} answer ${a}`).toBe(true);
      expect(new Set(q.options.map((o) => o.trim())).size, `${key} duplicate options`).toBe(q.options.length);
      for (const o of q.options) expect(o.trim(), key).not.toBe('');
      expect(q.prompt.trim(), key).not.toBe('');
      expect(q.why.trim(), key).not.toBe('');
    }
  });
});
