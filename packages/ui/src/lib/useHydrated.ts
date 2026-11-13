import { useSyncExternalStore } from 'react';

// Nothing to subscribe to: the value only differs between the server/hydration pass and the client.
const noop = () => undefined;
const subscribe = () => noop;

/**
 * false while rendering on the server and during the hydration pass that adopts prerendered
 * HTML, true afterwards (and immediately for client-only renders). Gate anything random,
 * time-based or browser-only on it so server and client markup match.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
