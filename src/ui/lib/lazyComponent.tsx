import type { ComponentType } from 'react';

/**
 * React.lazy with a synchronous fast path: once preload() has resolved, the component renders
 * straight away instead of suspending. main.tsx preloads what a prerendered page shows before
 * hydrating, so the first client render matches the HTML; later navigations suspend as usual.
 */
export function lazyComponent<P extends object>(load: () => Promise<ComponentType<P>>) {
  let Loaded: ComponentType<P> | undefined;
  let pending: Promise<void> | undefined;
  let failed: { error: unknown } | undefined;
  const preload = () =>
    (pending ??= load().then(
      (component) => {
        Loaded = component;
        failed = undefined;
      },
      (error: unknown) => {
        pending = undefined; // a later preload() retries
        failed = { error };
        throw error;
      },
    ));
  function Lazy(props: P) {
    // Like React.lazy: a failed load is a render error; until loaded, suspend (React re-renders when it settles).
    if (failed) throw failed.error;
    if (!Loaded) throw preload().catch(() => undefined);
    const Component = Loaded as ComponentType<P>;
    return <Component {...props} />;
  }
  return Object.assign(Lazy, { preload });
}
