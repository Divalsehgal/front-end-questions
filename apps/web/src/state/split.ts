import { useSyncExternalStore } from 'react';

// Coding drills on wide screens: how much of the width the problem pane takes (percent), the rest
// going to the editor. Dragged by the splitter between them; one setting shared by every drill.
export const SPLIT_MIN = 25;
export const SPLIT_MAX = 75;
export const SPLIT_DEFAULT = 50;

const KEY = 'grind:split:code';
const listeners = new Set<() => void>();

const clamp = (pct: number) => Math.round(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pct)));

function load(): number {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return typeof raw === 'number' && Number.isFinite(raw) ? clamp(raw) : SPLIT_DEFAULT;
  } catch {
    return SPLIT_DEFAULT;
  }
}

let split = load();

export function setCodeSplit(pct: number) {
  const next = clamp(pct);
  if (next === split) return;
  split = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(split));
  } catch {
    // Private mode: remembered for this tab only.
  }
  listeners.forEach((l) => l());
}

export const resetCodeSplit = () => setCodeSplit(SPLIT_DEFAULT);

export function useCodeSplit(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => split,
    // Prerendered HTML uses the even split; a stored one applies right after hydration.
    () => SPLIT_DEFAULT,
  );
}
