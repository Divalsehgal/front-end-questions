import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf, subjectHref, SUBJECTS } from '../../content/registry';
import { KINDS } from '../../questions/registry';
import { record, resetProgress } from '../../state/progress';
import { location, renderWithRouter } from '../../test/render';
import { SubjectPage } from '.';

const subject = SUBJECTS.find((s) => new Set(ALL.filter((e) => e.subject.slug === s.slug).map((e) => e.q.kind)).size > 1)!;
const entries = ALL.filter((e) => e.subject.slug === subject.slug);
const page = (slug = subject.slug) => renderWithRouter(<SubjectPage />, { route: subjectHref(slug), path: '/s/:subject' });

beforeEach(() => resetProgress());
afterEach(() => resetProgress());

describe('SubjectPage', () => {
  it('redirects home for an unknown subject', () => {
    page('nope');
    expect(location()).toBe('/');
  });

  it('lists every topic with progress and starts at the first open question', async () => {
    const { user } = page();
    expect(screen.getByRole('heading', { level: 1, name: subject.title })).toBeInTheDocument();
    expect(screen.getByText(`0 of ${entries.length} solved`)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(subject.topics.length);
    await user.click(screen.getByRole('link', { name: 'Start' }));
    expect(location()).toBe(hrefOf(entries[0].key));
  });

  it('continues after the solved questions', async () => {
    act(() => record(entries[0].key, true));
    const { user } = page();
    await user.click(screen.getByRole('link', { name: 'Continue' }));
    expect(location()).toBe(hrefOf(entries[1].key));
  });

  it('filters by question kind with the radio chips', async () => {
    const { user } = page();
    const group = screen.getByRole('radiogroup', { name: 'Filter by question type' });
    const kind = entries.at(-1)!.q.kind;
    await user.click(within(group).getByRole('radio', { name: new RegExp(KINDS[kind].plural) }));
    const icons = screen.getAllByRole('img', { name: /.+/ }).filter((i) => Object.values(KINDS).some((k) => k.label === i.getAttribute('aria-label')));
    expect(icons).toHaveLength(entries.filter((e) => e.q.kind === kind).length);
    expect(icons.every((i) => i.getAttribute('aria-label') === KINDS[kind].label)).toBe(true);
  });
});
