// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const load = () => import('./analytics');

beforeEach(() => {
  vi.resetModules();
  delete window.dataLayer;
});
afterEach(() => vi.unstubAllEnvs());

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
