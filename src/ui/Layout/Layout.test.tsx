import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL, hrefOf, subjectHref, SUBJECTS } from '../../content/registry';
import { updateProfile } from '../../state/profile';
import { record, resetProgress } from '../../state/progress';
import { setRoute, usePathname } from '../../test/navigation';
import { searchQuestions } from './Search';
import { Layout, MAIN_ID } from '.';

function Page() {
  return <h1>Page body {usePathname()}</h1>;
}

function renderLayout(route = '/') {
  setRoute(route);
  return render(
    <Layout>
      <Page />
    </Layout>,
  );
}

describe('Layout', () => {
  beforeEach(() => resetProgress());
  afterEach(() => resetProgress());

  it('has banner, navigation and main landmarks', () => {
    renderLayout();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('link')).toHaveLength(3 + SUBJECTS.length);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', MAIN_ID);
    expect(within(main).getByRole('heading', { name: /Page body/ })).toBeInTheDocument();
  });

  it('links to settings from the header and shows the welcome card on a first visit', () => {
    updateProfile({ welcomed: false });
    renderLayout();
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Settings and backups' })).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('region', { name: 'Welcome to FE Grind' })).toBeInTheDocument();
    updateProfile({ welcomed: true });
  });

  it('offers a skip link as the first tab stop that moves focus to main without changing the route', async () => {
    const user = userEvent.setup();
    renderLayout('/review');
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByRole('link', { name: /Review/ })).toHaveAttribute('aria-current', 'page');
  });

  it('marks the active subject and shows solved counts and due reviews', () => {
    const first = ALL[0];
    act(() => record(first.key, false));
    renderLayout(subjectHref(first.subject.slug));
    const link = screen.getByRole('link', { name: new RegExp(first.subject.title) });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveTextContent(/0\/\d+ solved/);
    expect(screen.getByRole('link', { name: /Review/ })).toHaveTextContent('1 due');
  });

  it('toggles the colour theme', async () => {
    renderLayout();
    const before = document.documentElement.classList.contains('dark');
    const toggle = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
    await userEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(!before);
    expect(screen.getByRole('button', { name: `Switch to ${before ? 'dark' : 'light'} mode` })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Switch to/ }));
  });

  it('opens search with Cmd/Ctrl+K and goes to the chosen question', async () => {
    const user = userEvent.setup();
    renderLayout();
    const target = ALL[0];
    await user.keyboard('{Control>}k{/Control}');
    const box = screen.getByRole('combobox', { name: 'Search questions' });
    expect(box).toHaveFocus();
    await user.type(box, target.q.title);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent(target.q.title);
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: `Page body ${hrefOf(target.key)}` })).toBeInTheDocument();
  });

  it('opens search from the sidebar and closes on Escape', async () => {
    const user = userEvent.setup();
    renderLayout();
    await user.click(screen.getByRole('button', { name: /Search/ }));
    expect(screen.getByRole('dialog', { name: 'Search questions' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('searchQuestions', () => {
  it('needs every word, ranks title hits first and ignores an empty query', () => {
    expect(searchQuestions('  ')).toEqual([]);
    const words = ALL[0].q.title.split(' ').slice(0, 2).join(' ').toUpperCase();
    const hits = searchQuestions(words);
    expect(hits.length).toBeGreaterThan(0);
    expect(
      hits.every((e) =>
        words
          .toLowerCase()
          .split(' ')
          .every((w) => `${e.q.title} ${e.topic.title} ${e.subject.title}`.toLowerCase().includes(w)),
      ),
    ).toBe(true);
    expect(searchQuestions('zzzz-no-such-question')).toEqual([]);
  });
});
