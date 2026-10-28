import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf, SUBJECTS } from '../../content/registry';
import { resetProgress, type Attempt } from '../../state/progress';
import { endSession } from '../../state/session';
import { location, renderWithRouter, storedSession } from '../../test/render';
import { pickRound } from './pickRound';
import { MockSetup } from '.';

beforeEach(() => {
  resetProgress();
  endSession();
});
afterEach(() => endSession());

describe('MockSetup', () => {
  it('starts a timed round with the chosen size and navigates to its first question', async () => {
    const { user } = renderWithRouter(<MockSetup />);
    expect(screen.getByRole('radiogroup', { name: 'Questions' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: '5' }));
    expect(screen.getByRole('radio', { name: '5' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('button', { name: 'Start round' }));
    expect(storedSession()?.kind).toBe('mock');
    expect(storedSession()?.keys).toHaveLength(5);
    expect(location()).toBe(hrefOf(storedSession()!.keys[0]));
  });

  it('filters the pool by subject and kind, and can add a coding drill', async () => {
    const { user } = renderWithRouter(<MockSetup />);
    const subjects = screen.getByRole('group', { name: 'Subjects' });
    expect(subjects).toBeInTheDocument();
    for (const s of SUBJECTS) await user.click(screen.getByRole('button', { name: s.title }));
    expect(screen.getByText('0 questions match')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start round' })).toBeDisabled();
    const js = SUBJECTS.find((s) => ALL.some((e) => e.subject.slug === s.slug && e.q.kind === 'code'))!;
    await user.click(screen.getByRole('button', { name: js.title }));
    await user.click(screen.getByRole('button', { name: 'Quizzes' }));
    expect(screen.getByRole('button', { name: 'Quizzes' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('checkbox', { name: 'Finish with one coding drill' }));
    await user.click(screen.getByRole('button', { name: 'Start round' }));
    const keys = storedSession()!.keys;
    expect(ALL.find((e) => e.key === keys[keys.length - 1])?.q.kind).toBe('code');
    expect(keys.every((k) => k.startsWith(`${js.slug}:`))).toBe(true);
  });

  it('does nothing when the round would be empty', async () => {
    const { user } = renderWithRouter(<MockSetup />);
    for (const s of SUBJECTS) await user.click(screen.getByRole('button', { name: s.title }));
    await user.click(screen.getByRole('checkbox', { name: 'Finish with one coding drill' }));
    await user.click(screen.getByRole('button', { name: 'Start round' }));
    expect(storedSession()).toBeNull();
    expect(location()).toBe('/');
  });
});

describe('pickRound', () => {
  const att = (status: Attempt['status']): Attempt => ({ status, attempts: 1, firstTry: false, box: 0, due: 0, updated: 0 });
  it('puts missed, then unseen, before solved questions', () => {
    const [a, b, c] = ALL;
    const progress = { [a.key]: att('correct'), [c.key]: att('wrong') };
    const picked = pickRound([a, b, c], progress, 2, [], () => 0.5);
    expect(picked.map((e) => e.key).sort()).toEqual([b.key, c.key].sort());
    expect(pickRound([a], {}, 5, [b], () => 0).map((e) => e.key)).toEqual([a.key, b.key]);
  });
});
