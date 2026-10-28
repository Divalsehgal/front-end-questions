import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { Attempt } from '../state/progress';
import type { Session } from '../state/session';
import type { ReactElement } from 'react';

/** Shows the current path so tests can assert on navigation. */
function LocationProbe() {
  const { pathname } = useLocation();
  return <output data-testid="location">{pathname}</output>;
}

/** Renders `ui` inside a router at `route`; `path` is the route pattern when the component reads params. */
export function renderWithRouter(ui: ReactElement, { route = '/', path = '*', ...options }: { route?: string; path?: string } & RenderOptions = {}) {
  const user = userEvent.setup();
  const result = render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        {path !== '*' && <Route path="*" element={null} />}
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
    options,
  );
  return { user, ...result };
}

export const location = (container: HTMLElement = document.body) => container.querySelector('[data-testid="location"]')?.textContent;

// The progress and session stores persist synchronously, so tests can read what they hold.
export const storedSession = (): Session | null => JSON.parse(sessionStorage.getItem('grind:session') ?? 'null');
export const storedProgress = (): Record<string, Attempt> => JSON.parse(localStorage.getItem('grind:progress:v2') ?? '{}');
