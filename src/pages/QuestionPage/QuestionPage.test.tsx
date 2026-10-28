import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL, hrefOf, subjectHref } from '../../content/registry';
import { preloadAllViews } from '../../questions/registry';
import { resetProgress } from '../../state/progress';
import { endSession, startSession } from '../../state/session';
import { location, renderWithRouter, storedProgress, storedSession } from '../../test/render';
import { neighbours, relatedTo } from './RelatedQuestions';
import { QuestionPage } from '.';

// Views are lazy chunks; main.tsx preloads the current one before hydrating.
beforeAll(() => preloadAllViews());

const cards = ALL.filter((e) => e.q.kind === 'flashcard');
const card = cards[0];
const siblings = ALL.filter((e) => e.subject.slug === card.subject.slug);
const index = siblings.findIndex((e) => e.key === card.key);

const page = (key = card.key) => renderWithRouter(<QuestionPage />, { route: hrefOf(key), path: '/q/:subject/:id' });

beforeEach(() => {
  resetProgress();
  endSession();
});
afterEach(() => {
  endSession();
  vi.useRealTimers();
});

describe('QuestionPage', () => {
  it('redirects home for an unknown question', () => {
    page('js:does-not-exist');
    expect(location()).toBe('/');
  });

  it('shows the question with breadcrumb and moves focus to its title', () => {
    page();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveFocus();
    expect(h1.closest('header')).toHaveTextContent('Flashcard');
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(crumbs).toHaveTextContent(card.subject.title);
    expect(screen.getByText('Not attempted')).toHaveClass('sr-only');
  });

  it('records the first answer to progress', async () => {
    const { user } = page();
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }));
    await user.click(screen.getByRole('button', { name: 'I knew it' }));
    expect(storedProgress()[card.key]?.status).toBe('correct');
    expect(screen.getByText('Solved')).toHaveClass('sr-only');
  });

  it('walks the subject with previous / next', async () => {
    const { user } = page();
    const next = siblings[index + 1];
    const prevButton = screen.getByRole('button', { name: 'Previous question' });
    expect(prevButton).toHaveProperty('disabled', index === 0);
    await user.click(screen.getByRole('button', { name: next ? 'Next' : 'Done' }));
    expect(location()).toBe(next ? hrefOf(next.key) : subjectHref(card.subject.slug));
  });

  it('follows a mock session with a timer, finishes to the summary and can quit', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const [a, b] = cards;
    act(() => startSession('mock', [a.key, b.key]));
    const first = page(a.key);
    expect(screen.getByText(/Mock round · 1 \/ 2/)).toBeInTheDocument();
    expect(screen.getByRole('timer', { name: 'Elapsed time' })).toHaveTextContent('0:00');
    await act(() => vi.advanceTimersByTimeAsync(65_000));
    expect(screen.getByRole('timer')).toHaveTextContent('1:05');
    await first.user.click(screen.getByRole('button', { name: 'Next' }));
    expect(location()).toBe(hrefOf(b.key));
    first.unmount();

    const second = page(b.key);
    await second.user.click(screen.getByRole('button', { name: 'Previous question' }));
    expect(location()).toBe(hrefOf(a.key));
    second.unmount();

    const last = page(b.key);
    await last.user.click(screen.getByRole('button', { name: 'Finish' }));
    expect(location()).toBe('/session');
    last.unmount();

    const quit = page(a.key);
    await quit.user.click(screen.getByRole('button', { name: 'Quit' }));
    expect(location()).toBe(subjectHref(a.subject.slug));
    expect(storedSession()).toBeNull();
  });

  it('labels review sessions without a timer', () => {
    act(() => startSession('review', [card.key]));
    page();
    expect(screen.getByText(/Review · 1 \/ 1/)).toBeInTheDocument();
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('links to previous / next, related questions in the topic and the subject with real hrefs', async () => {
    const { user } = page();
    const more = screen.getByRole('navigation', { name: `More ${card.subject.title} questions` });
    const { prev, next } = neighbours(card);
    if (prev) expect(within(more).getByRole('link', { name: new RegExp(`Previous`) })).toHaveAttribute('href', hrefOf(prev.key));
    if (next) expect(within(more).getByRole('link', { name: new RegExp(`Next`) })).toHaveAttribute('href', hrefOf(next.key));
    const related = relatedTo(card);
    expect(within(more).queryAllByRole('listitem')).toHaveLength(related.length);
    await user.click(within(more).getByRole('link', { name: `All ${card.subject.title} interview questions` }));
    expect(location()).toBe(subjectHref(card.subject.slug));
  });

  it('picks neighbours in subject order and related questions from the same topic', () => {
    const subject = ALL.filter((e) => e.subject === ALL[0].subject);
    expect(neighbours(subject[0])).toEqual({ prev: undefined, next: subject[1] });
    expect(neighbours(subject.at(-1)!).next).toBeUndefined();
    const topic = ALL.filter((e) => e.topic === ALL[1].topic);
    const related = relatedTo(ALL[1], 3);
    expect(related.length).toBeLessThanOrEqual(3);
    for (const r of related) expect(topic).toContain(r);
    expect(related).not.toContain(ALL[1]);
  });

  it('hides related links during a session', () => {
    act(() => startSession('review', [card.key]));
    page();
    expect(screen.queryByRole('navigation', { name: /More .* questions/ })).not.toBeInTheDocument();
  });
});
