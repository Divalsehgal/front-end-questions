import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchPath, setRoute, usePathname } from './navigation';
import type { Attempt } from '../state/progress';
import type { Session } from '../state/session';
import type { ReactElement } from 'react';

/** Shows the current path so tests can assert on navigation. */
function LocationProbe() {
  const pathname = usePathname();
  return <output data-testid="location">{pathname}</output>;
}

/** Renders children only while the current path matches `path`, like a route. */
function AtPath({ path, children }: Readonly<{ path: string; children: ReactElement }>) {
  return matchPath(path, usePathname()) ? children : null;
}

/** Renders `ui` inside a router at `route`; `path` is the route pattern when the component reads params. */
export function renderWithRouter(ui: ReactElement, { route = '/', path = '*', ...options }: { route?: string; path?: string } & RenderOptions = {}) {
  const user = userEvent.setup();
  setRoute(route, path);
  const result = render(
    <>
      <AtPath path={path}>{ui}</AtPath>
      <LocationProbe />
    </>,
    options,
  );
  return { user, ...result };
}

export const location = (container: HTMLElement = document.body) => container.querySelector('[data-testid="location"]')?.textContent;

// The progress and session stores persist synchronously, so tests can read what they hold.
export const storedSession = (): Session | null => JSON.parse(sessionStorage.getItem('grind:session') ?? 'null');
export const storedProgress = (): Record<string, Attempt> => JSON.parse(localStorage.getItem('grind:progress:v2') ?? '{}');
