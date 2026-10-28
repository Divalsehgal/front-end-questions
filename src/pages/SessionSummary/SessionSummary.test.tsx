import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf } from '../../content/registry';
import { endSession, recordInSession, startSession } from '../../state/session';
import { location, renderWithRouter, storedSession } from '../../test/render';
import { SessionSummary } from '.';

const page = () => renderWithRouter(<SessionSummary />, { route: '/session', path: '/session' });

afterEach(() => endSession());

describe('SessionSummary', () => {
  it('redirects home without a session', () => {
    page();
    expect(location()).toBe('/');
  });

  it('scores a mock round and retries the misses as a review', async () => {
    const [a, b, c] = ALL;
    act(() => {
      startSession('mock', [a.key, b.key, c.key, 'missing:key']);
      recordInSession(a.key, true);
      recordInSession(b.key, false);
    });
    const { user } = page();
    expect(screen.getByRole('heading', { name: 'Round complete' })).toBeInTheDocument();
    expect(screen.getByText('correct on the first try').previousElementSibling).toHaveTextContent('1 / 4');
    expect(screen.getByRole('img', { name: 'Correct' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Missed' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Not answered' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Questions in this round' }).children).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Retry the 1 I missed' }));
    expect(storedSession()).toEqual(expect.objectContaining({ kind: 'review', keys: [b.key] }));
    expect(location()).toBe(hrefOf(b.key));
  });

  it('ends a review and goes back to the dashboard', async () => {
    act(() => startSession('review', [ALL[0].key]));
    const { user } = page();
    expect(screen.getByRole('heading', { name: 'Review complete' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back to dashboard' }));
    expect(storedSession()).toBeNull();
    expect(location()).toBe('/');
  });

  it('offers a new mock round', async () => {
    act(() => startSession('mock', [ALL[0].key]));
    const { user } = page();
    await user.click(screen.getByRole('button', { name: 'New round' }));
    expect(location()).toBe('/mock');
    expect(storedSession()).toBeNull();
  });
});
