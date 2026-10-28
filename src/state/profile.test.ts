// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'grind:profile';
const load = () => import('./profile');

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('profile', () => {
  it('starts with no name and the welcome card unanswered', async () => {
    const { useProfile } = await load();
    expect(renderHook(useProfile).result.current).toEqual({ name: '', welcomed: false });
  });

  it('saves updates, keeping typed spaces and capping the length', async () => {
    const { useProfile, updateProfile } = await load();
    const { result } = renderHook(useProfile);
    act(() => updateProfile({ name: 'Ada ' }));
    expect(result.current.name).toBe('Ada ');
    act(() => updateProfile({ welcomed: true, name: 'x'.repeat(60) }));
    expect(result.current).toEqual({ name: 'x'.repeat(40), welcomed: true });
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(result.current);
  });

  it('loads what was saved, ignoring malformed fields', async () => {
    localStorage.setItem(KEY, JSON.stringify({ name: 'Ada', welcomed: true }));
    expect(renderHook((await load()).useProfile).result.current).toEqual({ name: 'Ada', welcomed: true });
    vi.resetModules();
    localStorage.setItem(KEY, JSON.stringify({ name: 7, welcomed: 'yes' }));
    expect(renderHook((await load()).useProfile).result.current).toEqual({ name: '', welcomed: false });
    vi.resetModules();
    localStorage.setItem(KEY, 'null');
    expect(renderHook((await load()).useProfile).result.current).toEqual({ name: '', welcomed: false });
    vi.resetModules();
    localStorage.setItem(KEY, '{bad');
    expect(renderHook((await load()).useProfile).result.current).toEqual({ name: '', welcomed: false });
  });

  it('survives storage being unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { updateProfile } = await load();
    expect(() => updateProfile({ name: 'Ada' })).not.toThrow();
  });

  it('renders as welcomed with no name on the server, so the prerender has no card', async () => {
    const { useProfile } = await load();
    function Probe() {
      const p = useProfile();
      return createElement('p', null, `${p.name}|${String(p.welcomed)}`);
    }
    expect(renderToString(createElement(Probe))).toContain('|true');
  });
});
