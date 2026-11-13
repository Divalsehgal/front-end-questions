import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'grind:theme';
const listeners = new Set<() => void>();

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function system(): Theme {
  try {
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    // No matchMedia (old browsers, jsdom): default to light rather than crash on import.
    return 'light';
  }
}
let theme: Theme = stored() ?? system();

export function applyTheme() {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // ignore
  }
  applyTheme();
  listeners.forEach((l) => l());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => theme,
    // Server render / hydration: light. The real theme class is set by an inline script in index.html
    // before first paint, and components re-render with the stored theme right after hydration.
    () => 'light' as Theme,
  );
}
