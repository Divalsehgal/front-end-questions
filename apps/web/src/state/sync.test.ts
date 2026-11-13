// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeHandle, memoryDb, stubPicker } from '../test/fakeStorage';

const db = new Map<string, unknown>();
vi.mock('./storage/db', () => memoryDb(db));

const KEY = 'grind:progress:v2';
const attempt = (updated: number, status: 'correct' | 'wrong' = 'correct') => ({ status, attempts: 1, firstTry: true, box: 2, due: 0, updated });
const load = async () => ({ ...(await import('./sync')), ...(await import('./progress')) });
const exported = async () => JSON.parse((await import('./progress')).exportProgress()) as Record<string, { updated: number }>;

beforeEach(() => {
  localStorage.clear();
  db.clear();
  vi.resetModules();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('hydrateStorage', () => {
  it('copies localStorage progress into IndexedDB on the first visit after the move', async () => {
    localStorage.setItem(KEY, JSON.stringify({ 'js:a': attempt(5) }));
    await (await load()).hydrateStorage();
    expect(db.get(KEY)).toEqual({ 'js:a': attempt(5) });
  });

  it('merges IndexedDB into the localStorage mirror, newest attempt per question winning', async () => {
    localStorage.setItem(KEY, JSON.stringify({ 'js:a': attempt(5), 'js:b': attempt(1) }));
    db.set(KEY, { 'js:b': attempt(9, 'wrong'), 'js:c': attempt(3) });
    await (await load()).hydrateStorage();
    const p = await exported();
    expect(Object.keys(p).sort((a, b) => a.localeCompare(b))).toEqual(['js:a', 'js:b', 'js:c']);
    expect(p['js:b'].updated).toBe(9);
    expect(JSON.parse(localStorage.getItem(KEY)!)['js:c'].updated).toBe(3);
  });

  it('restores everything from IndexedDB after localStorage was cleared', async () => {
    db.set(KEY, { 'js:a': attempt(5) });
    await (await load()).hydrateStorage();
    expect(Object.keys(await exported())).toEqual(['js:a']);
  });

  it('merges a still-permitted synced file, and survives a broken one', async () => {
    stubPicker(null);
    db.set('progress-file', fakeHandle('p.json', JSON.stringify({ 'js:f': attempt(4) })));
    await (await load()).hydrateStorage();
    expect(Object.keys(await exported())).toEqual(['js:f']);

    vi.resetModules();
    db.set('progress-file', fakeHandle('p.json', 'not json'));
    await expect((await load()).hydrateStorage()).resolves.toBeUndefined();
  });

  it('keeps working without IndexedDB', async () => {
    const { idbGet } = await import('./storage/db');
    vi.mocked(idbGet).mockRejectedValueOnce(new Error('no idb'));
    localStorage.setItem(KEY, JSON.stringify({ 'js:a': attempt(5) }));
    await (await load()).hydrateStorage();
    expect(Object.keys(await exported())).toEqual(['js:a']);
  });
});

describe('connecting a file', () => {
  it('writes current progress into a new, empty file', async () => {
    const h = fakeHandle('new.json', '');
    stubPicker(h);
    const { connectProgressFile, record } = await load();
    record('js:a', true);
    await connectProgressFile();
    await vi.runAllTimersAsync();
    expect(Object.keys(JSON.parse(h.content))).toEqual(['js:a']);
  });

  it('merges an existing progress file in, then keeps it up to date', async () => {
    const h = fakeHandle('old.json', JSON.stringify({ 'js:old': attempt(1) }));
    stubPicker(h);
    const { connectProgressFile, record } = await load();
    await connectProgressFile();
    record('js:new', true);
    await vi.runAllTimersAsync();
    expect(Object.keys(JSON.parse(h.content)).sort((a, b) => a.localeCompare(b))).toEqual(['js:new', 'js:old']);
  });

  it('overwrites a file that is not progress (the save dialog confirmed replacing it)', async () => {
    const h = fakeHandle('notes.json', '[1,2,3]');
    stubPicker(h);
    await (await load()).connectProgressFile();
    await vi.runAllTimersAsync();
    expect(h.content).toBe('{}');
  });

  it('reconnects a lapsed file and reports a refusal', async () => {
    stubPicker(null);
    const h = fakeHandle('p.json', JSON.stringify({ 'js:f': attempt(4) }), 'prompt');
    db.set('progress-file', h);
    const { hydrateStorage, reconnectProgressFile } = await load();
    await hydrateStorage();
    expect(await reconnectProgressFile()).toBe(false);
    h.permission = 'granted';
    expect(await reconnectProgressFile()).toBe(true);
    expect(Object.keys(await exported())).toEqual(['js:f']);
  });
});
