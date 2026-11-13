import { useSyncExternalStore } from 'react';

type Clock = { subscribe: (onTick: () => void) => () => void; read: () => number };

const serverNow = () => 0;
const clocks = new Map<number | undefined, Clock>();

/** One clock per interval: the time is read when a component mounts and again on every tick, never mid-render. */
function clockFor(intervalMs?: number): Clock {
  let clock = clocks.get(intervalMs);
  if (!clock) {
    let now = 0;
    clock = {
      subscribe: (onTick) => {
        now = Date.now();
        if (!intervalMs) return () => undefined;
        const t = setInterval(() => {
          now = Date.now();
          onTick();
        }, intervalMs);
        return () => clearInterval(t);
      },
      read: () => (now ||= Date.now()),
    };
    clocks.set(intervalMs, clock);
  }
  return clock;
}

/**
 * The current time, read like an external store. It is 0 on the server and while hydrating: a prerendered page
 * must not depend on when it was built (Cache Components rejects clock reads there), so callers treat 0 as
 * "no time yet". After that it is the time the component mounted, refreshed every `intervalMs` when given.
 */
export function useNow(intervalMs?: number) {
  const clock = clockFor(intervalMs);
  return useSyncExternalStore(clock.subscribe, clock.read, serverNow);
}
