// Persistent storage: without it, browsers may clear IndexedDB and localStorage under disk
// pressure (and Safari after 7 days without a visit). Chrome grants it from engagement, Firefox
// asks the user; either way it is a request, so callers treat `false` as "best effort only".

/** Asks the browser to never evict this site's data on its own. Resolves false when refused or unsupported. */
export async function requestPersistence(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

/** Whether persistence is already granted. */
export async function isPersisted(): Promise<boolean> {
  try {
    return (await navigator.storage?.persisted?.()) ?? false;
  } catch {
    return false;
  }
}
