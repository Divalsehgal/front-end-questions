import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const load = () => import('./db');

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('indexedDB', new IDBFactory());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('IndexedDB key-value store', () => {
  it('stores, reads back and deletes structured values', async () => {
    const { idbGet, idbSet, idbDelete } = await load();
    expect(await idbGet('k')).toBeUndefined();
    await idbSet('k', { a: [1, 2], n: 3 });
    expect(await idbGet('k')).toEqual({ a: [1, 2], n: 3 });
    await idbDelete('k');
    expect(await idbGet('k')).toBeUndefined();
  });

  it('keeps data across module reloads (a new page load)', async () => {
    await (await load()).idbSet('k', 'kept');
    vi.resetModules();
    expect(await (await load()).idbGet('k')).toBe('kept');
  });

  it('rejects when IndexedDB is missing, then works once it is back', async () => {
    vi.stubGlobal('indexedDB', undefined);
    const { idbGet, idbSet } = await load();
    await expect(idbGet('k')).rejects.toThrow();
    vi.stubGlobal('indexedDB', new IDBFactory());
    await idbSet('k', 1);
    expect(await idbGet('k')).toBe(1);
  });

  it('rejects when the database cannot be opened', async () => {
    const req = { error: new DOMException('blocked'), onerror: null as null | (() => void) };
    vi.stubGlobal('indexedDB', {
      open: () => {
        queueMicrotask(() => req.onerror?.());
        return req;
      },
    });
    await expect((await load()).idbGet('k')).rejects.toThrow('blocked');
  });

  it('rejects a write the store refuses (values that cannot be cloned)', async () => {
    await expect((await load()).idbSet('k', () => 1)).rejects.toThrow();
  });
});
