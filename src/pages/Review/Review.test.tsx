import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL, hrefOf } from '../../content/registry';
import { record, resetProgress, type Attempt } from '../../state/progress';
import { endSession } from '../../state/session';
import { location, renderWithRouter, storedProgress, storedSession } from '../../test/render';
import { DAY, reviewSchedule } from './schedule';
import { Review } from '.';

const page = () => renderWithRouter(<Review />);

beforeEach(() => {
  resetProgress();
  endSession();
});
afterEach(() => endSession());

describe('Review', () => {
  it('shows an empty state when nothing is due', () => {
    page();
    expect(screen.getByText('All caught up')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start review' })).not.toBeInTheDocument();
  });

  it('lists due questions and starts a review session', async () => {
    act(() => {
      record(ALL[0].key, false);
      record(ALL[1].key, true);
    });
    const { user } = page();
    expect(screen.getByText('1 due now')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Due questions' }).children).toHaveLength(1);
    expect(screen.getByText('Tomorrow').previousElementSibling).toHaveTextContent('0');
    await user.click(screen.getByRole('button', { name: 'Start review' }));
    expect(storedSession()).toEqual(expect.objectContaining({ kind: 'review', keys: [ALL[0].key] }));
    expect(location()).toBe(hrefOf(ALL[0].key));
  });

  it('resets progress only after confirming', async () => {
    act(() => record(ALL[0].key, false));
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { user } = page();
    await user.click(screen.getByRole('button', { name: 'Reset all progress' }));
    expect(Object.keys(storedProgress())).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Reset all progress' }));
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(storedProgress()).toEqual({});
  });
});

describe('reviewSchedule', () => {
  it('sorts due items by due date and buckets upcoming ones', () => {
    const now = 1_000 * DAY;
    const at = (due: number): Attempt => ({ status: 'correct', attempts: 1, firstTry: true, box: 1, due, updated: 0 });
    const [a, b, c, d, e] = ALL;
    const { due, buckets } = reviewSchedule(
      { [a.key]: at(now - 1), [b.key]: at(now - 5), [c.key]: at(now + DAY / 2), [d.key]: at(now + 3 * DAY), [e.key]: at(now + 30 * DAY) },
      now,
      [a, b, c, d, e],
    );
    expect(due.map((x) => x.key)).toEqual([b.key, a.key]);
    expect(buckets.map((x) => x.n)).toEqual([1, 1, 1]);
  });
});
