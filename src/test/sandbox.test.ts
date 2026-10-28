import { describe, expect, it } from 'vitest';
import { runSnippet } from './sandbox';

describe('runSnippet (node mirror of the predict worker)', () => {
  it('runs top-level code with `this` undefined, like an ES module', async () => {
    expect(await runSnippet('console.log(this)')).toEqual(['undefined']);
    expect(await runSnippet('function f() { return this; } console.log(f())')).toEqual(['undefined']);
  });
});
