// Which DSA questions this browser has ticked off. A store with an empty server snapshot, so the
// prerendered tree matches the first client render and the ticks fill in right after.
import { useSyncExternalStore } from 'react';

const KEY = 'dsa-done';
const EMPTY: ReadonlySet<string> = new Set();
let done: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();

function read(): ReadonlySet<string> {
  if (!done) {
    try {
      done = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]);
    } catch {
      done = new Set();
    }
  }
  return done;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useDone = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export function toggleDone(name: string) {
  const next = new Set(read());
  if (next.has(name)) next.delete(name);
  else next.add(name);
  done = next;
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // storage blocked: ticks just won't persist
  }
  listeners.forEach((l) => l());
}

/** For tests: forget the in-memory copy. */
export function resetDone() {
  done = null;
}
