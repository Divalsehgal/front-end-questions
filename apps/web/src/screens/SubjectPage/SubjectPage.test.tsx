import { ALL, hrefOf, subjectHref, SUBJECTS } from '@fe-grind/content/registry';
import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { KINDS } from '../../questions/registry';
import { subjectFaq, subjectJsonLd } from '../../seo';
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
    // One per topic card, plus "Topics" and the FAQ.
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(subject.topics.length + 2);
    await user.click(screen.getByRole('link', { name: 'Start' }));
    expect(location()).toBe(hrefOf(entries[0].key));
  });

  it('links each topic from the breakdown and shows the FAQ that its FAQPage JSON-LD repeats', () => {
    page();
    const topics = screen.getByRole('region', { name: 'Topics' });
    expect(within(topics).getAllByRole('link')).toHaveLength(subject.topics.length);
    expect(within(topics).getAllByRole('link')[0]).toHaveAttribute('href', `#topic-${subject.topics[0].slug}`);
    expect(document.getElementById(`topic-${subject.topics[0].slug}`)).toBeInTheDocument();
    const faq = screen.getByRole('region', { name: /FAQ/ });
    for (const f of subjectFaq(subject)) {
      expect(within(faq).getByText(f.q)).toBeInTheDocument();
      expect(within(faq).getByText(f.a)).toBeInTheDocument();
    }
    const ld = subjectJsonLd(subject).find((d) => (d as { '@type': string })['@type'] === 'FAQPage') as { mainEntity: { name: string }[] };
    expect(ld.mainEntity.map((m) => m.name)).toEqual(subjectFaq(subject).map((f) => f.q));
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
