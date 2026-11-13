import { useSyncExternalStore } from 'react';
import { idbSet } from './storage/db';
import { writeToFile } from './storage/fileSync';

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

// localStorage holds a synchronous mirror so the first paint after a reload already shows
// progress; IndexedDB (same key) is the durable copy, and a synced file a third (see ./sync.ts).
export const PROGRESS_KEY = 'grind:progress:v2';
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
    return sanitize(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}'));
  } catch {
    return {};
  }
}

let progress: Progress = load();

function save() {
  const json = JSON.stringify(progress);
  try {
    localStorage.setItem(PROGRESS_KEY, json);
  } catch {
    // Storage unavailable (private mode): IndexedDB or the file may still take it.
  }
  idbSet(PROGRESS_KEY, progress).catch(() => {
    // No IndexedDB (private mode, old browser): the localStorage mirror is all there is.
  });
  writeToFile(json);
  listeners.forEach((l) => l());
}

/** Rewrites every copy (localStorage, IndexedDB, synced file) from what is in memory. */
export const syncProgress = save;

/** Combines two copies of progress, keeping the most recently updated attempt for each question. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const out = { ...a };
  for (const [key, attempt] of Object.entries(b)) {
    if (!out[key] || attempt.updated > out[key].updated) out[key] = attempt;
  }
  return out;
}

/** Merges another copy (IndexedDB, a synced file, a backup) into the current progress and saves everywhere. */
export function adoptProgress(raw: unknown) {
  progress = mergeProgress(progress, sanitize(raw));
  save();
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

/**
 * Merges a backup into the current progress (newest attempt per question wins), so restoring an
 * old backup never loses newer answers. Throws on anything that isn't a progress export
 * (invalid JSON, an array, null…). Returns how many questions the backup held.
 */
export function importProgress(json: string) {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed)) throw new Error('Not a progress export: expected a JSON object');
  const incoming = sanitize(parsed);
  adoptProgress(incoming);
  return Object.keys(incoming).length;
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
