// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'grind:split:code';
const load = () => import('./split');

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe('code split state', () => {
  it('starts even', async () => {
    const { useCodeSplit, SPLIT_DEFAULT } = await load();
    expect(renderHook(useCodeSplit).result.current).toBe(SPLIT_DEFAULT);
  });

  it('clamps, rounds and saves', async () => {
    const { useCodeSplit, setCodeSplit, resetCodeSplit, SPLIT_MIN, SPLIT_MAX, SPLIT_DEFAULT } = await load();
    const { result } = renderHook(useCodeSplit);
    act(() => setCodeSplit(61.6));
    expect(result.current).toBe(62);
    expect(localStorage.getItem(KEY)).toBe('62');
    act(() => setCodeSplit(5));
    expect(result.current).toBe(SPLIT_MIN);
    act(() => setCodeSplit(99));
    expect(result.current).toBe(SPLIT_MAX);
    act(resetCodeSplit);
    expect(result.current).toBe(SPLIT_DEFAULT);
  });

  it('restores a stored split and ignores junk', async () => {
    localStorage.setItem(KEY, '40');
    expect(renderHook((await load()).useCodeSplit).result.current).toBe(40);
    vi.resetModules();
    localStorage.setItem(KEY, '"wide"');
    const { useCodeSplit, SPLIT_DEFAULT } = await load();
    expect(renderHook(useCodeSplit).result.current).toBe(SPLIT_DEFAULT);
  });

  it('renders the default on the server, whatever is stored', async () => {
    localStorage.setItem(KEY, '30');
    const { useCodeSplit } = await load();
    const Probe = () => String(useCodeSplit());
    expect(renderToString(createElement(Probe))).toBe('50');
  });
});
