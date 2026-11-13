import { adoptProgress, importProgress, PROGRESS_KEY, syncProgress } from './progress';
import { idbGet } from './storage/db';
import { connectFile, reconnectFile, restoreFileSync } from './storage/fileSync';

// Brings the copies of progress together: the localStorage mirror (already loaded), the durable
// IndexedDB copy and an optional synced file. Merging keeps the newest attempt per question, so
// whichever copy survived (cleared localStorage, a fresh browser, an old file) nothing is lost.

/** Applies a synced file's contents. An empty (new) file gets the current progress written to it. */
function adoptFile(text: string | null) {
  if (text === null) return;
  if (text.trim()) importProgress(text);
  else syncProgress();
}

/** Startup, client only: merges IndexedDB and a still-permitted synced file into memory. */
export async function hydrateStorage() {
  const fromDb = await idbGet<unknown>(PROGRESS_KEY).catch(() => undefined);
  // First visit since the IndexedDB move: write the localStorage progress into IndexedDB.
  if (fromDb === undefined) syncProgress();
  else adoptProgress(fromDb);
  try {
    adoptFile(await restoreFileSync());
  } catch {
    // An unreadable or hand-broken file: keep the browser copy; the next answer rewrites the file.
  }
}

/** From a click: picks a file to sync to, merging in anything it already holds. */
export async function connectProgressFile() {
  const text = await connectFile();
  try {
    adoptFile(text);
  } catch {
    // Not a progress file: the save dialog already confirmed replacing it.
    syncProgress();
  }
}

/** From a click: restores write access to the remembered file. False when the user refused. */
export async function reconnectProgressFile() {
  const text = await reconnectFile();
  adoptFile(text);
  return text !== null;
}
