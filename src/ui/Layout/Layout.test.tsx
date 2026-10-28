import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL, subjectHref, SUBJECTS } from '../../content/registry';
import { updateProfile } from '../../state/profile';
import { record, resetProgress } from '../../state/progress';
import { Layout, MAIN_ID } from '.';

function renderLayout(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<h1>Page body</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
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
    expect(within(main).getByRole('heading', { name: 'Page body' })).toBeInTheDocument();
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
});
