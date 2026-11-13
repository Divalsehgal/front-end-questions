import { useSyncExternalStore } from 'react';

// A "session" is an ordered queue of questions (a review or a mock round).
// While one is active, "Next" walks the queue instead of the topic.
export type Session = {
  kind: 'review' | 'mock';
  keys: string[];
  results: Record<string, boolean>;
  startedAt: number;
};

const KEY = 'grind:session';
const listeners = new Set<() => void>();

const isSession = (v: unknown): v is Session => {
  const s = v as Session | null;
  return (
    typeof s === 'object' &&
    s !== null &&
    (s.kind === 'review' || s.kind === 'mock') &&
    Array.isArray(s.keys) &&
    typeof s.results === 'object' &&
    s.results !== null &&
    typeof s.startedAt === 'number'
  );
};

function load(): Session | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

let session: Session | null = load();

function set(next: Session | null) {
  session = next;
  try {
    if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
    else sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export const startSession = (kind: Session['kind'], keys: string[]) => set({ kind, keys, results: {}, startedAt: Date.now() });
export const endSession = () => set(null);

export function recordInSession(key: string, correct: boolean) {
  // Only the first answer counts towards the round's score.
  if (session && session.keys.includes(key) && !(key in session.results)) {
    set({ ...session, results: { ...session.results, [key]: correct } });
  }
}

export function useSession() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => session,
    // Server render / hydration: no session (it lives in sessionStorage).
    () => null,
  );
}
