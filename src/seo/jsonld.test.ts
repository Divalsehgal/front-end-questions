import { describe, expect, it } from 'vitest';
import { BANK_ENTRIES as ALL } from '../content/bank';
import { getSubject, type FullEntry as Entry } from '../content/registry';
import { breadcrumbs, homeJsonLd, questionJsonLd, serializeJsonLd, subjectJsonLd } from './jsonld';
import { SITE_URL } from './site';
import { stripMarkdown } from './text';
import type { QuizQuestion } from '../content/types';

type Ld = Record<string, unknown> & { '@type': string };
const find = (pred: (e: Entry) => boolean) => ALL.find(pred)!;
const isQuiz = (e: Entry): e is Entry & { q: QuizQuestion } => e.q.kind === 'quiz';
const single = find((e) => isQuiz(e) && !Array.isArray(e.q.answer)) as Entry & { q: QuizQuestion };
const multi = find((e) => isQuiz(e) && Array.isArray(e.q.answer)) as Entry & { q: QuizQuestion };

describe('WebSite', () => {
  it('names the site and its author, without a SearchAction (there is no site search)', () => {
    const [site] = homeJsonLd() as Ld[];
    expect(site).toMatchObject({ '@context': 'https://schema.org', '@type': 'WebSite', url: SITE_URL, author: { '@type': 'Person', name: 'Dival Sehgal' } });
    expect(site).not.toHaveProperty('potentialAction');
  });
});

describe('BreadcrumbList and ItemList', () => {
  it('numbers breadcrumb items from 1', () => {
    expect(
      breadcrumbs([
        { name: 'A', url: 'u1' },
        { name: 'B', url: 'u2' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'A', item: 'u1' },
        { position: 2, name: 'B', item: 'u2' },
      ],
    });
  });

  it('lists every question of a subject with absolute URLs', () => {
    const s = getSubject('react')!;
    const [crumbs, list] = subjectJsonLd(s) as unknown as [Ld, Ld & { itemListElement: { url: string; position: number }[] }];
    expect(crumbs['@type']).toBe('BreadcrumbList');
    const count = s.topics.reduce((n, t) => n + t.questions.length, 0);
    expect(list.numberOfItems).toBe(count);
    expect(list.itemListElement).toHaveLength(count);
    expect(list.itemListElement[0]).toMatchObject({ position: 1, url: expect.stringMatching(new RegExp(`^${SITE_URL}q/react/.+/$`)) });
  });
});

describe('question JSON-LD', () => {
  it('marks a single-answer quiz up as a Quiz with accepted and suggested answers matching the visible options', () => {
    const [crumbs, quiz] = questionJsonLd(single) as Ld[];
    expect((crumbs.itemListElement as unknown[]).length).toBe(3);
    expect(quiz).toMatchObject({ '@type': 'Quiz', about: { '@type': 'Thing', name: single.subject.title }, isAccessibleForFree: true });
    expect(['Beginner', 'Intermediate', 'Advanced']).toContain(quiz.educationalLevel);
    const [part] = quiz.hasPart as Ld[];
    expect(part).toMatchObject({ '@type': 'Question', eduQuestionType: 'Multiple choice', text: stripMarkdown(single.q.prompt) });
    const accepted = part.acceptedAnswer as Ld;
    expect(accepted.text).toBe(stripMarkdown(single.q.options[single.q.answer as number]));
    expect(accepted.answerExplanation).toEqual({ '@type': 'Comment', text: stripMarkdown(single.q.why) });
    expect(part.suggestedAnswer).toHaveLength(single.q.options.length - 1);
  });

  it('uses Checkbox and several accepted answers for select-all quizzes', () => {
    const [, quiz] = questionJsonLd(multi) as Ld[];
    const [part] = quiz.hasPart as Ld[];
    expect(part.eduQuestionType).toBe('Checkbox');
    expect(part.acceptedAnswer).toHaveLength((multi.q.answer as number[]).length);
  });

  it('marks flashcards up as a Question with the back as the accepted answer', () => {
    const card = find((e) => e.q.kind === 'flashcard');
    const [, quiz] = questionJsonLd(card) as Ld[];
    const [part] = quiz.hasPart as Ld[];
    expect(part).toMatchObject({ eduQuestionType: 'Flashcard', acceptedAnswer: { '@type': 'Answer' } });
  });

  it('marks other kinds up as a LearningResource without answers', () => {
    for (const kind of ['code', 'ui', 'output', 'order']) {
      const [, res] = questionJsonLd(find((e) => e.q.kind === kind)) as Ld[];
      expect(res['@type']).toBe('LearningResource');
      expect(res).not.toHaveProperty('hasPart');
      expect(res.learningResourceType).toEqual(expect.any(String));
    }
  });

  it('defaults the level to Intermediate when a question has no difficulty', () => {
    const e = { ...single, q: { ...single.q, difficulty: undefined } };
    expect((questionJsonLd(e)[1] as Ld).educationalLevel).toBe('Intermediate');
  });
});

describe('serializeJsonLd', () => {
  it('cannot close the script tag or open a comment, and still parses back to the same data', () => {
    const data = { text: '</script><script>alert(1)</script> <!-- & \u2028\u2029' };
    const json = serializeJsonLd(data);
    expect(json).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(json)).toEqual(data);
  });

  it('serialises every page of real content safely', () => {
    for (const e of ALL) for (const d of questionJsonLd(e)) expect(serializeJsonLd(d)).not.toContain('</');
  });
});
