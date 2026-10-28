// Duplicate "subject:id" keys fail the manifest build (vite-plugins/content-manifest.ts).
import { describe, expect, it } from 'vitest';
import { duplicateKeys, toManifest } from './manifest';
import type { Subject } from './types';

const subject = (ids: string[]): Subject => ({
  slug: 's',
  title: 'S',
  blurb: '',
  icon: 'x',
  topics: [{ slug: 't', title: 'T', questions: ids.map((id) => ({ kind: 'flashcard', id, title: id, front: 'f', back: 'b' })) }],
});

describe('duplicateKeys', () => {
  it('lists keys that occur more than once', () => {
    expect(duplicateKeys([subject(['a', 'b', 'a'])])).toEqual(['s:a']);
  });

  it('is empty when ids are unique', () => {
    expect(duplicateKeys([subject(['a', 'b'])])).toEqual([]);
  });
});

describe('toManifest', () => {
  it('keeps subject and topic fields and only id/title/kind/difficulty per question', () => {
    const s = subject(['a']);
    s.topics[0].questions.push({ kind: 'quiz', id: 'q', title: 'Q', difficulty: 'hard', prompt: 'p', options: ['x', 'y'], answer: 0, why: 'w' });
    expect(toManifest([s])).toEqual([
      {
        slug: 's',
        title: 'S',
        blurb: '',
        icon: 'x',
        topics: [
          {
            slug: 't',
            title: 'T',
            questions: [
              { id: 'a', title: 'a', kind: 'flashcard' },
              { id: 'q', title: 'Q', kind: 'quiz', difficulty: 'hard' },
            ],
          },
        ],
      },
    ]);
  });
});
