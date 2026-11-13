import { describe, expect, it } from 'vitest';
import { legacyRedirectTarget } from './legacyRedirect';

const ORIGIN = 'https://grind.example';
const target = (hash: string, base = '/') => legacyRedirectTarget(hash, ORIGIN, base);

describe('legacyRedirectTarget', () => {
  it('maps a HashRouter link to the real page under the base path', () => {
    expect(target('#/q/react/h-17')).toBe(`${ORIGIN}/q/react/h-17`);
    expect(target('#/q/react/h-17', '/grind/')).toBe(`${ORIGIN}/grind/q/react/h-17`);
    expect(target('#/s/javascript')).toBe(`${ORIGIN}/s/javascript`);
  });

  it('does nothing without a legacy hash', () => {
    expect(target('')).toBeNull();
    expect(target('#')).toBeNull();
    expect(target('#/')).toBeNull();
    expect(target('#section')).toBeNull();
  });

  it.each([
    '#//evil.com',
    '#//evil.com/path',
    String.raw`#/\evil.com`,
    String.raw`#/\\evil.com`,
    '#/https://evil.com',
    '#/%2F%2Fevil.com',
    '#/javascript:alert(1)',
    '#/q//evil.com',
    '#/../etc',
    '#/q/react?x=1',
  ])('refuses to leave the app for %s', (hash) => {
    expect(target(hash)).toBeNull();
    expect(target(hash, '/grind/')).toBeNull();
  });
});
