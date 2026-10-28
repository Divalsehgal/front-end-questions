import { afterEach, describe, expect, it, vi } from 'vitest';
import { isPersisted, requestPersistence } from './persist';

const stubStorage = (storage: unknown) => vi.stubGlobal('navigator', { storage });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('persistent storage', () => {
  it('reports what the browser grants', async () => {
    stubStorage({ persist: () => Promise.resolve(true), persisted: () => Promise.resolve(false) });
    expect(await requestPersistence()).toBe(true);
    expect(await isPersisted()).toBe(false);
  });

  it('is false when the API is missing', async () => {
    stubStorage(undefined);
    expect(await requestPersistence()).toBe(false);
    expect(await isPersisted()).toBe(false);
  });

  it('is false when the browser throws', async () => {
    stubStorage({ persist: () => Promise.reject(new Error('no')), persisted: () => Promise.reject(new Error('no')) });
    expect(await requestPersistence()).toBe(false);
    expect(await isPersisted()).toBe(false);
  });
});
