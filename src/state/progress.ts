import { useSyncExternalStore } from 'react';

// Leitner-style spaced repetition: a correct answer moves the card up a box and
// pushes it further out; a wrong answer sends it back to box 0, due right away.
const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
const DAY = 24 * 60 * 60 * 1000;

export type Attempt = {
  status: 'correct' | 'wrong';
  attempts: number;
  /** Correct on the very first try, ever. */
  firstTry: boolean;
  box: number;
  due: number;
  updated: number;
};

type Progress = Record<string, Attempt>;

const KEY = 'grind:progress:v2';
const listeners = new Set<() => void>();

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const isAttempt = (v: unknown): v is Attempt =>
  isRecord(v) &&
  (v.status === 'correct' || v.status === 'wrong') &&
  [v.attempts, v.box, v.due, v.updated].every((n) => typeof n === 'number' && Number.isFinite(n)) &&
  typeof v.firstTry === 'boolean';

/** Keeps only well-formed attempts, so hand-edited or corrupted data can't break record(). */
function sanitize(raw: unknown): Progress {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([, a]) => isAttempt(a))) as Progress;
}

function load(): Progress {
  try {
    return sanitize(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
  } catch {
    return {};
  }
}

let progress: Progress = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode): progress lives for this tab only.
  }
  listeners.forEach((l) => l());
}

export function record(key: string, correct: boolean) {
  const prev = progress[key];
  const now = Date.now();
  // A right answer moves up one box (two on a first-time right answer); a wrong one goes back to box 0.
  const step = prev ? 1 : 2;
  const box = correct ? Math.min((prev?.box ?? 0) + step, INTERVAL_DAYS.length - 1) : 0;
  progress = {
    ...progress,
    [key]: {
      status: correct ? 'correct' : 'wrong',
      attempts: (prev?.attempts ?? 0) + 1,
      firstTry: prev ? prev.firstTry : correct,
      box,
      due: correct ? now + INTERVAL_DAYS[box] * DAY : now,
      updated: now,
    },
  };
  save();
}

export function resetProgress() {
  progress = {};
  save();
}

export function exportProgress() {
  return JSON.stringify(progress, null, 2);
}

/** Throws on anything that isn't a progress export (invalid JSON, an array, null…). */
export function importProgress(json: string) {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed)) throw new Error('Not a progress export: expected a JSON object');
  progress = sanitize(parsed);
  save();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// Prerendered HTML (and the hydration pass that adopts it) shows "no progress"; React then
// re-renders with what localStorage holds, so server and client markup always match.
const NO_PROGRESS: Progress = {};

export function useProgress(): Progress {
  return useSyncExternalStore(
    subscribe,
    () => progress,
    () => NO_PROGRESS,
  );
}

export const isDue = (a: Attempt | undefined, now = Date.now()) => !!a && a.due <= now;

// Per-question code drafts, so a half-written solution survives a reload.
const draftKey = (id: string) => `grind:draft:${id}`;
export function loadDraft(id: string): string | null {
  try {
    return localStorage.getItem(draftKey(id));
  } catch {
    return null;
  }
}
export function saveDraft(id: string, code: string) {
  try {
    localStorage.setItem(draftKey(id), code);
  } catch {
    // ignore
  }
}
export function clearDraft(id: string) {
  try {
    localStorage.removeItem(draftKey(id));
  } catch {
    // ignore
  }
}
