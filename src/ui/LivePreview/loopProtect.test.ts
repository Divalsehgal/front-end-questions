import { describe, expect, it } from 'vitest';
import { protectLoops } from './loopProtect';

const G = 'if (__lp()) break;';

describe('protectLoops', () => {
  it('guards braced for / for-of / for-await / while / do loops', () => {
    expect(protectLoops('for (let i = 0; i < 3; i++) { a(); }')).toBe(`for (let i = 0; i < 3; i++) {${G} a(); }`);
    expect(protectLoops('for (const x of xs){}')).toBe(`for (const x of xs){${G}}`);
    expect(protectLoops('for await (const x of xs) {}')).toBe(`for await (const x of xs) {${G}}`);
    expect(protectLoops('while (f(g(1))) {}')).toBe(`while (f(g(1))) {${G}}`);
    expect(protectLoops('do { x++ } while (x < 3)')).toBe(`do {${G} x++ } while (x < 3)`);
  });

  it('leaves strings, comments, identifiers and brace-less bodies alone', () => {
    const untouched = [
      "const s = 'for (;;) {}';",
      '// while (true) {}',
      '/* do { } */',
      'const t = `while (1) {`;',
      'forEach(() => {}); doThing({}); obj.for = 1; whileLoop() {}',
      'while (x) x--;',
      'do x++; while (x < 3)',
    ];
    for (const src of untouched) expect(protectLoops(src)).toBe(src);
  });

  it('handles parens inside strings in the loop header', () => {
    expect(protectLoops("for (const c of ')(') {}")).toBe(`for (const c of ')(') {${G}}`);
  });
});
