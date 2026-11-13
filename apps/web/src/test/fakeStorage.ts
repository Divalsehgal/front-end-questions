// Test doubles for durable storage: an in-memory stand-in for ./state/storage/db (real IndexedDB
// can't structured-clone a fake file handle full of functions) and a fake file handle.
import { vi } from 'vitest';

/** Backing map for a `vi.mock('…/storage/db', () => memoryDb(map))`. */
export function memoryDb(map: Map<string, unknown>) {
  return {
    idbGet: vi.fn((key: string) => Promise.resolve(map.get(key))),
    idbSet: vi.fn((key: string, value: unknown) => {
      map.set(key, value);
      return Promise.resolve();
    }),
    idbDelete: vi.fn((key: string) => {
      map.delete(key);
      return Promise.resolve();
    }),
  };
}

export type FakeHandle = ReturnType<typeof fakeHandle>;

/** A FileSystemFileHandle look-alike whose content and permission tests can read and change. */
export function fakeHandle(name = 'progress.json', content = '', permission: PermissionState = 'granted') {
  const h = {
    name,
    content,
    permission,
    failWrites: false,
    getFile: () => Promise.resolve({ text: () => Promise.resolve(h.content) }),
    createWritable: () => {
      if (h.failWrites) return Promise.reject(new Error('NotFoundError'));
      let buf = '';
      return Promise.resolve({
        write: (d: string) => {
          buf += d;
          return Promise.resolve();
        },
        close: () => {
          h.content = buf;
          return Promise.resolve();
        },
      });
    },
    queryPermission: vi.fn(() => Promise.resolve(h.permission)),
    requestPermission: vi.fn(() => Promise.resolve(h.permission)),
  };
  return h;
}

/** Installs a showSaveFilePicker that resolves to `handle` (or rejects with `error`). */
export function stubPicker(handle: FakeHandle | null, error?: unknown) {
  const picker = vi.fn(() => (error === undefined ? Promise.resolve(handle) : Promise.reject(error as Error)));
  vi.stubGlobal('showSaveFilePicker', picker);
  return picker;
}

export const abortError = () => new DOMException('The user aborted a request.', 'AbortError');
