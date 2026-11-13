export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
/** Label for the platform's primary modifier key. */
export const MOD = isMac ? '⌘' : 'Ctrl';
