import { useSyncExternalStore } from 'react';

// Who is practising (an optional first name, never sent anywhere) and whether the first-visit
// welcome card has been answered or dismissed.
export type Profile = { name: string; welcomed: boolean };

const KEY = 'grind:profile';
const NAME_MAX = 40;
const listeners = new Set<() => void>();

// Only printable text, capped; control characters never reach storage.
const cleanName = (name: unknown) => (typeof name === 'string' ? name.replaceAll(/\p{C}/gu, '').slice(0, NAME_MAX) : '');

function load(): Profile {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    const v = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
    return { name: cleanName(v.name), welcomed: v.welcomed === true };
  } catch {
    return { name: '', welcomed: false };
  }
}

let profile: Profile = load();

export function updateProfile(patch: Partial<Profile>) {
  // Kept as typed (a trailing space mid-typing must survive); readers trim.
  profile = { name: cleanName(patch.name ?? profile.name), welcomed: (patch.welcomed ?? profile.welcomed) === true };
  try {
    localStorage.setItem(KEY, JSON.stringify({ name: profile.name, welcomed: profile.welcomed }));
  } catch {
    // Private mode: remembered for this tab only.
  }
  listeners.forEach((l) => l());
}

// Prerendered HTML has no name and no welcome card; both appear right after hydration.
const SERVER_PROFILE: Profile = { name: '', welcomed: true };

export function useProfile(): Profile {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => profile,
    () => SERVER_PROFILE,
  );
}
