import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf, subjectHref, SUBJECTS } from '../../content/registry';
import { updateProfile } from '../../state/profile';
import { record, resetProgress } from '../../state/progress';
import { location, renderWithRouter } from '../../test/render';
import { weakTopics } from './weakTopics';
import { Dashboard } from '.';

beforeEach(() => resetProgress());
afterEach(() => resetProgress());

describe('Dashboard', () => {
  it('greets by name once one is set', () => {
    updateProfile({ name: ' Ada ' });
    const { unmount } = renderWithRouter(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1, name: "Let's get started, Ada" })).toBeInTheDocument();
    unmount();
    act(() => record(ALL[0].key, true));
    renderWithRouter(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1, name: 'Keep the streak going, Ada' })).toBeInTheDocument();
    updateProfile({ name: '' });
  });

  it('greets a new user and starts at the first question', async () => {
    const { user } = renderWithRouter(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1, name: 'Frontend interview grind' })).toBeInTheDocument();
    expect(screen.getByText(`0 / ${ALL.length}`)).toBeInTheDocument();
    expect(screen.getByText('–')).toBeInTheDocument();
    expect(screen.queryByText('Weakest topics')).not.toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(SUBJECTS.length);
    await user.click(screen.getByRole('link', { name: 'Start with the first question' }));
    expect(location()).toBe(hrefOf(ALL[0].key));
  });

  it('shows stats, due reviews and the weakest topics once you have answered', async () => {
    const [a, b] = ALL;
    act(() => {
      record(a.key, true);
      record(b.key, false);
    });
    const { user } = renderWithRouter(<Dashboard />);
    expect(screen.getByRole('heading', { level: 1, name: 'Keep the streak going' })).toBeInTheDocument();
    expect(screen.getByText(`1 / ${ALL.length}`)).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    const weak = screen.getByRole('list', { name: 'Weakest topics' });
    expect(within(weak).getByText('1 missed')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Review 1 due/ }));
    expect(location()).toBe('/review');
  });

  it('links each subject card', async () => {
    const { user } = renderWithRouter(<Dashboard />);
    const s = SUBJECTS[0];
    expect(screen.getByRole('progressbar', { name: `${s.title} progress` })).toBeInTheDocument();
    await user.click(screen.getByRole('heading', { level: 3, name: s.title }));
    expect(location()).toBe(subjectHref(s.slug));
  });
});

describe('weakTopics', () => {
  it('ranks topics by misses and links the first missed question', () => {
    const t = SUBJECTS[0].topics[0];
    const keys = t.questions.slice(0, 2).map((q) => `${SUBJECTS[0].slug}:${q.id}`);
    const other = ALL.find((e) => e.topic !== t)!;
    const progress = Object.fromEntries(
      [...keys, other.key].map((k) => [k, { status: 'wrong' as const, attempts: 1, firstTry: false, box: 0, due: 0, updated: 0 }]),
    );
    const weak = weakTopics(progress);
    expect(weak[0]).toEqual(expect.objectContaining({ topic: t, wrong: 2, first: keys[0] }));
    expect(weakTopics(progress, 1)).toHaveLength(1);
    expect(weakTopics({})).toEqual([]);
  });
});
