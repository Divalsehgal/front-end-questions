// A memory stand-in for next/navigation and next/link in tests (src/test/next.ts mocks both with
// it): one current path, changed by <Link> clicks and router.push / replace.
import { useSyncExternalStore } from 'react';
import type { ComponentProps, MouseEvent } from 'react';

let pathname = '/';
let pattern = '*';
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const go = (href: string) => {
  pathname = href.split(/[?#]/)[0];
  listeners.forEach((l) => l());
};

/** Starts a test at `route`; `path` is the route pattern ("/q/:subject/:id") when the component reads params. */
export function setRoute(route: string, path = '*') {
  pathname = route;
  pattern = path;
  listeners.forEach((l) => l());
}

/** Params of `path` ("/q/:subject/:id") in `route`, or null when it doesn't match. Trailing slashes don't count. */
export function matchPath(path: string, route: string): Record<string, string> | null {
  if (path === '*') return {};
  const want = path.split('/').filter(Boolean);
  const got = route.split('/').filter(Boolean);
  if (want.length !== got.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < want.length; i++) {
    if (want[i].startsWith(':')) params[want[i].slice(1)] = decodeURIComponent(got[i]);
    else if (want[i] !== got[i]) return null;
  }
  return params;
}

export const usePathname = () =>
  useSyncExternalStore(
    subscribe,
    () => pathname,
    () => pathname,
  );
export function useParams() {
  return matchPath(pattern, usePathname()) ?? {};
}

const router = { push: go, replace: go, back: () => undefined, forward: () => undefined, refresh: () => undefined, prefetch: () => undefined };
export const useRouter = () => router;
export function notFound(): never {
  throw new Error('NEXT_NOT_FOUND');
}

export function Link({ href, onClick, children, ...rest }: Omit<ComponentProps<'a'>, 'href'> & { href: string }) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(href);
  };
  return (
    <a {...rest} href={href} onClick={click}>
      {children}
    </a>
  );
}
