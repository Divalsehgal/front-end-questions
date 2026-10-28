import { useSyncExternalStore } from 'react';
import { idbDelete, idbGet, idbSet } from './db';

// Optional sync of progress to a real file on disk (File System Access API: Chrome and Edge).
// The file survives clearing browser data. Its handle is kept in IndexedDB; browsers forget the
// write permission between visits, so after a reload the file may need one click to reconnect.

export type FileSyncStatus = 'unsupported' | 'off' | 'connected' | 'needs-permission' | 'error';
export type FileSyncState = { status: FileSyncStatus; name?: string };

type Writable = { write: (data: string) => Promise<void>; close: () => Promise<void> };
type PermissionMode = { mode: 'readwrite' };
export type SyncHandle = {
  name: string;
  getFile: () => Promise<{ text: () => Promise<string> }>;
  createWritable: () => Promise<Writable>;
  queryPermission: (o: PermissionMode) => Promise<PermissionState>;
  requestPermission: (o: PermissionMode) => Promise<PermissionState>;
};
type SavePicker = (options: object) => Promise<SyncHandle>;

const HANDLE_KEY = 'progress-file';
const RW: PermissionMode = { mode: 'readwrite' };
const WRITE_DELAY = 400;
const PICKER_OPTIONS = {
  suggestedName: 'fe-grind-progress.json',
  types: [{ description: 'FE Grind progress', accept: { 'application/json': ['.json'] } }],
};

/** The user closed the file picker: not an error. */
export const isAbort = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

const picker = () => (globalThis as { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
export const fileSyncSupported = () => typeof picker() === 'function';

let state: FileSyncState = { status: fileSyncSupported() ? 'off' : 'unsupported' };
let handle: SyncHandle | null = null;
let pending: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function set(next: FileSyncState) {
  state = next;
  listeners.forEach((l) => l());
}

const read = async (h: SyncHandle) => (await h.getFile()).text();

/** Startup: re-attaches the file chosen on an earlier visit. Returns its contents if access is still granted. */
export async function restoreFileSync(): Promise<string | null> {
  if (!fileSyncSupported()) return null;
  const saved = await idbGet<SyncHandle>(HANDLE_KEY);
  if (!saved) return null;
  handle = saved;
  if ((await saved.queryPermission(RW)) !== 'granted') {
    set({ status: 'needs-permission', name: saved.name });
    return null;
  }
  set({ status: 'connected', name: saved.name });
  return read(saved);
}

/** Must run from a click: lets the user pick or create the file, and returns what it already holds. */
export async function connectFile(): Promise<string> {
  const showPicker = picker();
  if (!showPicker) throw new Error('This browser cannot sync to a file');
  const chosen = await showPicker(PICKER_OPTIONS);
  handle = chosen;
  await idbSet(HANDLE_KEY, chosen).catch(() => {
    // Without IndexedDB the file still syncs for this visit; it just won't be remembered.
  });
  set({ status: 'connected', name: chosen.name });
  return read(chosen);
}

/** Must run from a click: asks again for write access to the remembered file. Null when refused. */
export async function reconnectFile(): Promise<string | null> {
  if (!handle) return null;
  if ((await handle.requestPermission(RW)) !== 'granted') return null;
  set({ status: 'connected', name: handle.name });
  return read(handle);
}

export async function disconnectFile() {
  clearTimeout(timer);
  handle = null;
  pending = null;
  set({ status: 'off' });
  await idbDelete(HANDLE_KEY).catch(() => {
    // Nothing remembered to forget.
  });
}

/** Queues the latest progress for the file; bursts of answers become one write. */
export function writeToFile(json: string) {
  if (state.status !== 'connected') return;
  pending = json;
  clearTimeout(timer);
  timer = setTimeout(() => void flush(), WRITE_DELAY);
}

async function flush() {
  const h = handle;
  const json = pending;
  pending = null;
  if (!h || json === null) return;
  try {
    const out = await h.createWritable();
    await out.write(json);
    await out.close();
  } catch {
    set({ status: 'error', name: h.name });
  }
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const SERVER_STATE: FileSyncState = { status: 'unsupported' };

export function useFileSync(): FileSyncState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}
