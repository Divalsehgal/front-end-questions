// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const load = () => import('./analytics');

beforeEach(() => {
  vi.resetModules();
  delete window.dataLayer;
  localStorage.clear();
  document.head.innerHTML = '<script></script>';
});
afterEach(() => {
  vi.unstubAllEnvs();
  window.history.replaceState(null, '', '/');
});

const runGtmScript = async () => new Function((await load()).GTM_SCRIPT)();
const gtmLoaded = () => [...document.scripts].some((s) => s.src.includes('googletagmanager.com/gtm.js?id=GTM-TEST'));

describe('owner mode', () => {
  beforeEach(() => vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-TEST'));

  it('loads GTM for normal visitors', async () => {
    await runGtmScript();
    expect(gtmLoaded()).toBe(true);
  });

  it('?owner=1 skips GTM now and on later visits, and silences track()', async () => {
    window.history.replaceState(null, '', '/?owner=1');
    await runGtmScript();
    expect(gtmLoaded()).toBe(false);

    window.history.replaceState(null, '', '/');
    await runGtmScript();
    expect(gtmLoaded()).toBe(false);
    (await load()).track('code_run', { question_id: 'x', passed: true });
    expect(window.dataLayer).toBeUndefined();
  });

  it('?owner=0 turns it back off', async () => {
    localStorage.setItem('fe-grind-owner', '1');
    window.history.replaceState(null, '', '/?owner=0');
    await runGtmScript();
    expect(gtmLoaded()).toBe(true);
  });
});

describe('track', () => {
  it('does nothing without a GTM id', async () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', '');
    (await load()).track('code_run', { question_id: 'x', passed: true });
    expect(window.dataLayer).toBeUndefined();
  });

  it("clears an earlier event's params so they don't ride along on the next one", async () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-TEST');
    const { track } = await load();
    track('search', { search_term: 'debounce', question_key: 'javascript:q' });
    track('code_run', { question_id: 'flatten', passed: false });
    expect(window.dataLayer).toEqual([
      { event: 'search', search_term: 'debounce', question_key: 'javascript:q' },
      { event: 'code_run', search_term: undefined, question_key: undefined, question_id: 'flatten', passed: false },
    ]);
  });
});
