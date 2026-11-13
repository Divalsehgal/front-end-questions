// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'grind:theme';
const load = () => import('./theme');
const prefersDark = (dark: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn((q: string) => ({ matches: dark, media: q })),
  );
const isDarkClass = () => document.documentElement.classList.contains('dark');

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('initial theme', () => {
  it('follows the system preference when nothing is stored', async () => {
    prefersDark(true);
    const { useTheme, applyTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('dark');
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    applyTheme();
    expect(isDarkClass()).toBe(true);
  });

  it('defaults to light when the system prefers light', async () => {
    prefersDark(false);
    const { useTheme, applyTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('light');
    applyTheme();
    expect(isDarkClass()).toBe(false);
  });

  it('prefers a stored theme over the system one', async () => {
    prefersDark(true);
    localStorage.setItem(KEY, 'light');
    const { useTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('light');
  });

  it('ignores an unknown stored value', async () => {
    prefersDark(true);
    localStorage.setItem(KEY, 'purple');
    const { useTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('dark');
  });

  it('falls back to the system theme when storage throws', async () => {
    prefersDark(true);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const { useTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('dark');
  });

  it('falls back to light when matchMedia is missing', async () => {
    vi.stubGlobal('matchMedia', undefined);
    const { useTheme } = await load();
    expect(renderHook(() => useTheme()).result.current).toBe('light');
  });
});

describe('toggleTheme', () => {
  it('flips, persists, applies the class and notifies subscribers', async () => {
    prefersDark(false);
    const { useTheme, toggleTheme } = await load();
    const { result, unmount } = renderHook(() => useTheme());
    act(() => toggleTheme());
    expect(result.current).toBe('dark');
    expect(localStorage.getItem(KEY)).toBe('dark');
    expect(isDarkClass()).toBe(true);
    act(() => toggleTheme());
    expect(result.current).toBe('light');
    expect(localStorage.getItem(KEY)).toBe('light');
    expect(isDarkClass()).toBe(false);
    unmount();
    expect(() => toggleTheme()).not.toThrow();
  });

  it('still toggles when storage cannot be written', async () => {
    prefersDark(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { useTheme, toggleTheme } = await load();
    const { result } = renderHook(() => useTheme());
    act(() => toggleTheme());
    expect(result.current).toBe('dark');
    expect(isDarkClass()).toBe(true);
  });
});
