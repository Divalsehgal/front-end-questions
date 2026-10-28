import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkContrast, CSS_PATH, parseTokens, ratio } from '../../scripts/check-contrast.js';

const css = readFileSync(CSS_PATH, 'utf8');

describe('design token contrast (WCAG 2.2 AA)', () => {
  it('matches the reference WCAG ratios', () => {
    expect(ratio('#000', '#fff')).toBeCloseTo(21, 5);
    expect(ratio('#0d2149', '#f9ebe0')).toBeCloseTo(13.52, 1);
    expect(ratio('#208aae', '#f9ebe0')).toBeCloseTo(3.39, 1);
  });

  it('defines the same tokens in light and dark themes', () => {
    const { light, dark } = parseTokens(css);
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it('keeps every text pair ≥ 4.5:1 and every UI pair ≥ 3:1 in both themes', () => {
    const failures = checkContrast(css).filter((r) => !r.ok);
    expect(failures.map((f) => `${f.theme}: --${f.fg} on --${f.bg} = ${f.ratio}:1 (needs ${f.min})`)).toEqual([]);
  });

  it('flags a failing pair', () => {
    const bad = css.replace(/--text-muted: #[0-9a-f]+;/, '--text-muted: #bbbbbb;');
    expect(checkContrast(bad).some((r) => !r.ok && r.fg === 'text-muted')).toBe(true);
  });
});
