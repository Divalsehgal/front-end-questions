// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const DAY = 24 * 60 * 60 * 1000;
const KEY = 'grind:progress:v2';
const stored = () => JSON.parse(localStorage.getItem(KEY)!);
const load = () => import('./progress');

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('spaced repetition', () => {
  it('schedules a first-try correct answer three days out and marks it firstTry', async () => {
    const { record, isDue } = await load();
    record('js:a', true);
    const saved = stored()['js:a'];
    expect(saved).toMatchObject({ status: 'correct', firstTry: true, attempts: 1, box: 2, due: 3 * DAY, updated: 0 });
    expect(isDue(saved, 2 * DAY)).toBe(false);
    expect(isDue(saved, 3 * DAY)).toBe(true);
  });

  it('a miss resets to box 0, due immediately, and is never firstTry', async () => {
    const { record } = await load();
    record('js:b', false);
    expect(stored()['js:b']).toMatchObject({ status: 'wrong', firstTry: false, box: 0, due: 0 });
    record('js:b', true);
    expect(stored()['js:b']).toMatchObject({ status: 'correct', firstTry: false, attempts: 2, box: 1, due: DAY });
  });

  it('walks up the boxes 3, 7, 14, 30 days and caps at the last box', async () => {
    const { record } = await load();
    const dues: number[] = [];
    for (let i = 0; i < 6; i++) {
      vi.setSystemTime(i * 100 * DAY);
      record('js:c', true);
      const a = stored()['js:c'];
      dues.push((a.due - a.updated) / DAY);
    }
    expect(dues).toEqual([3, 7, 14, 30, 30, 30]);
    expect(stored()['js:c']).toMatchObject({ box: 5, attempts: 6, firstTry: true });
  });

  it('a late miss drops a mastered card back to box 0 but keeps firstTry', async () => {
    const { record } = await load();
    record('js:d', true);
    record('js:d', true);
    vi.setSystemTime(10 * DAY);
    record('js:d', false);
    expect(stored()['js:d']).toMatchObject({ status: 'wrong', box: 0, due: 10 * DAY, firstTry: true, attempts: 3 });
  });

  it('isDue is false for unseen cards and uses Date.now by default', async () => {
    const { isDue } = await load();
    expect(isDue(undefined)).toBe(false);
    const a = { status: 'correct' as const, attempts: 1, firstTry: true, box: 2, due: 5, updated: 0 };
    vi.setSystemTime(4);
    expect(isDue(a)).toBe(false);
    vi.setSystemTime(5);
    expect(isDue(a)).toBe(true);
  });
});

describe('persistence', () => {
  it('reloads saved progress', async () => {
    (await load()).record('js:a', true);
    vi.resetModules();
    expect(JSON.parse((await load()).exportProgress())['js:a']).toMatchObject({ box: 2 });
  });

  it.each([
    ['invalid JSON', '{not json'],
    ['null', 'null'],
    ['an array', '[1,2]'],
    ['a number', '42'],
  ])('starts empty when storage holds %s', async (_, raw) => {
    localStorage.setItem(KEY, raw);
    const { record, exportProgress } = await load();
    expect(exportProgress()).toBe('{}');
    expect(() => record('js:a', true)).not.toThrow();
  });

  it('drops malformed entries but keeps good ones', async () => {
    const good = { status: 'correct', attempts: 1, firstTry: true, box: 2, due: 1, updated: 0 };
    localStorage.setItem(KEY, JSON.stringify({ good, bad: { box: '2' }, nul: null, str: 'x', nan: { ...good, due: null } }));
    const { exportProgress, record } = await load();
    expect(Object.keys(JSON.parse(exportProgress()))).toEqual(['good']);
    record('bad', true);
    expect(stored().bad.box).toBe(2);
  });

  it('keeps working in memory when storage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { record, exportProgress } = await load();
    expect(() => record('js:a', true)).not.toThrow();
    expect(JSON.parse(exportProgress())['js:a'].box).toBe(2);
  });
});

describe('reset / export / import', () => {
  it('round-trips through export and import', async () => {
    const { record, exportProgress, importProgress, resetProgress } = await load();
    record('js:a', true);
    const dump = exportProgress();
    expect(dump).toContain('\n  "js:a"'); // pretty-printed
    resetProgress();
    expect(exportProgress()).toBe('{}');
    expect(stored()).toEqual({});
    importProgress(dump);
    expect(stored()['js:a'].box).toBe(2);
  });

  it('rejects imports that are not a progress object and keeps the current data', async () => {
    const { record, importProgress, exportProgress } = await load();
    record('js:a', true);
    const before = exportProgress();
    expect(() => importProgress('nope')).toThrow(SyntaxError);
    expect(() => importProgress('null')).toThrow(/Not a progress export/);
    expect(() => importProgress('[]')).toThrow(/Not a progress export/);
    expect(exportProgress()).toBe(before);
  });

  it('merges a backup in, keeping the newer answer per question, and counts what it held', async () => {
    const { record, importProgress, exportProgress } = await load();
    vi.setSystemTime(10);
    record('js:a', true);
    record('js:b', true);
    const old = { status: 'wrong', attempts: 1, firstTry: false, box: 0, due: 0 };
    const n = importProgress(JSON.stringify({ 'js:a': { ...old, updated: 5 }, 'js:b': { ...old, updated: 20 }, 'js:c': { ...old, updated: 1 } }));
    expect(n).toBe(3);
    const p = JSON.parse(exportProgress());
    expect(p['js:a'].status).toBe('correct');
    expect(p['js:b'].status).toBe('wrong');
    expect(p['js:c']).toBeDefined();
  });
});

describe('mergeProgress', () => {
  it('takes the most recently updated attempt and keeps keys from both sides', async () => {
    const { mergeProgress } = await load();
    const at = (updated: number) => ({ status: 'correct' as const, attempts: 1, firstTry: true, box: 1, due: 0, updated });
    expect(mergeProgress({ a: at(1), b: at(5) }, { b: at(3), c: at(2) })).toEqual({ a: at(1), b: at(5), c: at(2) });
    expect(mergeProgress({ a: at(1) }, { a: at(4) }).a.updated).toBe(4);
  });
});

describe('useProgress', () => {
  it('re-renders on changes and unsubscribes on unmount', async () => {
    const { useProgress, record, resetProgress } = await load();
    const { result, unmount } = renderHook(() => useProgress());
    expect(result.current).toEqual({});
    act(() => record('js:a', true));
    expect(result.current['js:a'].box).toBe(2);
    act(() => resetProgress());
    expect(result.current).toEqual({});
    unmount();
    expect(() => record('js:b', true)).not.toThrow();
  });
});

describe('drafts', () => {
  it('survive a reload of the module and can be cleared', async () => {
    (await load()).saveDraft('js:c', 'code');
    vi.resetModules();
    const { loadDraft, clearDraft } = await load();
    expect(loadDraft('js:c')).toBe('code');
    expect(localStorage.getItem('grind:draft:js:c')).toBe('code');
    clearDraft('js:c');
    expect(loadDraft('js:c')).toBeNull();
  });

  it('degrade silently when storage throws', async () => {
    const { loadDraft, saveDraft, clearDraft } = await load();
    for (const m of ['getItem', 'setItem', 'removeItem'] as const) {
      vi.spyOn(Storage.prototype, m).mockImplementation(() => {
        throw new Error('denied');
      });
    }
    expect(loadDraft('x')).toBeNull();
    expect(() => saveDraft('x', 'y')).not.toThrow();
    expect(() => clearDraft('x')).not.toThrow();
  });
});
