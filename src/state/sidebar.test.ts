// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const KEY = 'grind:sidebar';
const load = () => import('./sidebar');

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sidebar state', () => {
  it('starts at the default width, shown', async () => {
    const { useSidebar, SIDEBAR_DEFAULT } = await load();
    expect(renderHook(useSidebar).result.current).toEqual({ width: SIDEBAR_DEFAULT, collapsed: false });
  });

  it('resizes within limits, collapses when dragged narrow, and saves', async () => {
    const { useSidebar, resizeSidebar, SIDEBAR_MIN, SIDEBAR_MAX, COLLAPSE_AT } = await load();
    const { result } = renderHook(useSidebar);
    act(() => resizeSidebar(300.4));
    expect(result.current).toEqual({ width: 300, collapsed: false });
    act(() => resizeSidebar(9999));
    expect(result.current.width).toBe(SIDEBAR_MAX);
    act(() => resizeSidebar(COLLAPSE_AT + 1));
    expect(result.current).toEqual({ width: SIDEBAR_MIN, collapsed: false });
    act(() => resizeSidebar(COLLAPSE_AT - 1));
    expect(result.current).toEqual({ width: SIDEBAR_MIN, collapsed: true });
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(result.current);
    act(() => resizeSidebar(260));
    expect(result.current).toEqual({ width: 260, collapsed: false });
  });

  it('toggles, sets and resets', async () => {
    const { useSidebar, toggleSidebar, setSidebarCollapsed, resetSidebarWidth, resizeSidebar, SIDEBAR_DEFAULT } = await load();
    const { result } = renderHook(useSidebar);
    act(() => toggleSidebar());
    expect(result.current.collapsed).toBe(true);
    act(() => setSidebarCollapsed(false));
    expect(result.current.collapsed).toBe(false);
    act(() => resizeSidebar(380));
    act(() => resetSidebarWidth());
    expect(result.current).toEqual({ width: SIDEBAR_DEFAULT, collapsed: false });
  });

  it('loads saved state, clamping and ignoring bad values', async () => {
    localStorage.setItem(KEY, JSON.stringify({ width: 9999, collapsed: true }));
    expect(renderHook((await load()).useSidebar).result.current).toEqual({ width: 420, collapsed: true });
    for (const raw of ['{"width":"wide"}', 'null', '{bad']) {
      vi.resetModules();
      localStorage.setItem(KEY, raw);
      expect(renderHook((await load()).useSidebar).result.current).toEqual({ width: 256, collapsed: false });
    }
  });

  it('survives storage being unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { toggleSidebar } = await load();
    expect(() => toggleSidebar()).not.toThrow();
  });

  it('renders the default layout on the server', async () => {
    localStorage.setItem(KEY, JSON.stringify({ width: 300, collapsed: true }));
    const { useSidebar } = await load();
    function Probe() {
      const s = useSidebar();
      return createElement('p', null, `${s.width}|${String(s.collapsed)}`);
    }
    expect(renderToString(createElement(Probe))).toContain('256|false');
  });
});
