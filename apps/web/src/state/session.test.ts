// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'grind:session';
const load = () => import('./session');
const stored = () => JSON.parse(sessionStorage.getItem(KEY) ?? 'null');

beforeEach(() => {
  sessionStorage.clear();
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(1234);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('session lifecycle', () => {
  it('starts a session, stores it and ends it', async () => {
    const { startSession, endSession } = await load();
    startSession('mock', ['js:a', 'js:b']);
    expect(stored()).toEqual({ kind: 'mock', keys: ['js:a', 'js:b'], results: {}, startedAt: 1234 });
    endSession();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('counts only the first answer for keys in the session', async () => {
    const { startSession, recordInSession } = await load();
    startSession('review', ['js:a', 'js:b']);
    recordInSession('js:a', false);
    recordInSession('js:a', true);
    recordInSession('js:other', true);
    expect(stored().results).toEqual({ 'js:a': false });
  });

  it('ignores answers when no session is active', async () => {
    const { recordInSession } = await load();
    expect(() => recordInSession('js:a', true)).not.toThrow();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('a new session replaces the old one', async () => {
    const { startSession, recordInSession } = await load();
    startSession('review', ['a']);
    recordInSession('a', true);
    startSession('mock', ['b']);
    expect(stored()).toMatchObject({ kind: 'mock', keys: ['b'], results: {} });
  });
});

describe('session storage', () => {
  it('restores the session after a reload', async () => {
    (await load()).startSession('review', ['js:a']);
    vi.resetModules();
    const { useSession } = await load();
    const { result } = renderHook(() => useSession());
    expect(result.current).toMatchObject({ kind: 'review', keys: ['js:a'] });
  });

  it.each([
    ['invalid JSON', '{'],
    ['a number', '5'],
    ['an array', '[]'],
    ['a wrong shape', JSON.stringify({ kind: 'mock', keys: 'nope', results: {}, startedAt: 0 })],
    ['an unknown kind', JSON.stringify({ kind: 'x', keys: [], results: {}, startedAt: 0 })],
    ['null results', JSON.stringify({ kind: 'mock', keys: [], results: null, startedAt: 0 })],
  ])('ignores %s in storage', async (_, raw) => {
    sessionStorage.setItem(KEY, raw);
    const { useSession, recordInSession } = await load();
    const { result } = renderHook(() => useSession());
    expect(result.current).toBeNull();
    expect(() => recordInSession('a', true)).not.toThrow();
  });

  it('keeps working in memory when storage throws', async () => {
    for (const m of ['getItem', 'setItem', 'removeItem'] as const) {
      vi.spyOn(Storage.prototype, m).mockImplementation(() => {
        throw new Error('denied');
      });
    }
    const { startSession, recordInSession, endSession, useSession } = await load();
    const { result } = renderHook(() => useSession());
    act(() => startSession('mock', ['a']));
    act(() => recordInSession('a', true));
    expect(result.current?.results).toEqual({ a: true });
    act(() => endSession());
    expect(result.current).toBeNull();
  });
});

describe('useSession', () => {
  it('re-renders on changes and unsubscribes on unmount', async () => {
    const { useSession, startSession, recordInSession, endSession } = await load();
    let renders = 0;
    const { result, unmount } = renderHook(() => {
      renders++;
      return useSession();
    });
    expect(result.current).toBeNull();
    act(() => startSession('review', ['a']));
    act(() => recordInSession('a', true));
    expect(result.current?.results).toEqual({ a: true });
    unmount();
    const before = renders;
    endSession();
    expect(renders).toBe(before);
  });
});
