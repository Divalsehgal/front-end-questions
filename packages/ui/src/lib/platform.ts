import { useHydrated } from './useHydrated';

/**
 * Label for the platform's primary modifier key. The server can't know the visitor's platform, so
 * prerendered HTML and the hydration pass say "Ctrl"; on a Mac it switches to ⌘ right after.
 */
export const useModKey = () => (useHydrated() && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl');
