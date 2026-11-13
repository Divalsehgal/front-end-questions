// A tiny promise wrapper over one IndexedDB key-value store: the durable copy of progress and
// the handle of a synced file live here. Every call rejects where IndexedDB is missing (the
// prerender, very old browsers, some private modes), so callers fall back to localStorage.
const DB_NAME = 'fe-grind';
const STORE = 'kv';

let opening: Promise<IDBDatabase> | null = null;

function open() {
  opening ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
  }).catch((err: unknown) => {
    // Let a later call try again (e.g. after the user leaves private mode).
    opening = null;
    throw err;
  });
  return opening;
}

async function run<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const req = op(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

export const idbGet = <T>(key: string) => run<T | undefined>('readonly', (s) => s.get(key));
export const idbSet = (key: string, value: unknown) => run<IDBValidKey>('readwrite', (s) => s.put(value, key)).then(() => undefined);
export const idbDelete = (key: string) => run<undefined>('readwrite', (s) => s.delete(key));
