import { useSyncExternalStore } from 'react';

// Desktop sidebar: its width (dragged by its edge) and whether it is hidden. Dragging the edge
// past COLLAPSE_AT hides it; the "show sidebar" button or Cmd/Ctrl+B brings it back.
export const SIDEBAR_MIN = 232;
export const SIDEBAR_MAX = 420;
export const SIDEBAR_DEFAULT = 256;
export const COLLAPSE_AT = 140;

export type SidebarState = { width: number; collapsed: boolean };

const KEY = 'grind:sidebar';
const DEFAULT: SidebarState = { width: SIDEBAR_DEFAULT, collapsed: false };
const listeners = new Set<() => void>();

const clamp = (px: number) => Math.round(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, px)));

function load(): SidebarState {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (typeof raw !== 'object' || raw === null) return DEFAULT;
    const { width, collapsed } = raw as Record<string, unknown>;
    return { width: typeof width === 'number' && Number.isFinite(width) ? clamp(width) : SIDEBAR_DEFAULT, collapsed: collapsed === true };
  } catch {
    return DEFAULT;
  }
}

let state: SidebarState = load();

function set(next: SidebarState) {
  if (next.width === state.width && next.collapsed === state.collapsed) return;
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode: remembered for this tab only.
  }
  listeners.forEach((l) => l());
}

/** Drag or keyboard resize to `px`; narrower than COLLAPSE_AT hides the sidebar. */
export function resizeSidebar(px: number) {
  set(px < COLLAPSE_AT ? { ...state, collapsed: true } : { width: clamp(px), collapsed: false });
}

export const setSidebarCollapsed = (collapsed: boolean) => set({ ...state, collapsed });
export const toggleSidebar = () => setSidebarCollapsed(!state.collapsed);
export const resetSidebarWidth = () => set({ width: SIDEBAR_DEFAULT, collapsed: false });

export function useSidebar(): SidebarState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    // Prerendered HTML uses the default layout; a stored width applies right after hydration.
    () => DEFAULT,
  );
}
