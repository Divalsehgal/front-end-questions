import { describe, expect, it } from 'vitest';
import { assert, fn } from './harness';

describe('assert.equal / notEqual / ok', () => {
  it('equal uses Object.is and prefixes an optional message', () => {
    expect(() => assert.equal(NaN, NaN)).not.toThrow();
    expect(() => assert.equal(0, -0)).toThrow(/expected -0, got 0/);
    expect(() => assert.equal('a', 'b', 'label')).toThrow("label: expected 'b', got 'a'");
    expect(() => assert.equal({}, {})).toThrow(/expected \{\}, got \{\}/);
  });

  it('throws an AssertionError', () => {
    try {
      assert.equal(1, 2);
      expect.unreachable();
    } catch (e) {
      expect((e as Error).name).toBe('AssertionError');
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('notEqual fails only on identical values', () => {
    expect(() => assert.notEqual(1, 2)).not.toThrow();
    expect(() => assert.notEqual(1, 1)).toThrow('expected a value other than 1');
    expect(() => assert.notEqual(1, 1, 'custom')).toThrow(/^custom$/);
  });

  it('ok checks truthiness', () => {
    expect(() => assert.ok(1)).not.toThrow();
    expect(() => assert.ok('')).toThrow("expected a truthy value, got ''");
    expect(() => assert.ok(0, 'zero')).toThrow(/^zero$/);
  });
});

describe('assert.deepEqual', () => {
  const eq = (a: unknown, b: unknown) => {
    try {
      assert.deepEqual(a, b);
      return true;
    } catch {
      return false;
    }
  };

  it('handles nested values, dates and cycles', () => {
    const a: Record<string, unknown> = { x: [1, { y: new Date(5) }] };
    a.self = a;
    const b: Record<string, unknown> = { x: [1, { y: new Date(5) }] };
    b.self = b;
    expect(eq(a, b)).toBe(true);
    expect(eq(new Date(1), new Date(2))).toBe(false);
    expect(eq([1, [2, [3]]], [1, [2, [3]]])).toBe(true);
    expect(eq([1, 2], [1, 2, 3])).toBe(false);
    expect(eq({ a: 1 }, { b: 1 })).toBe(false);
    expect(eq({ a: undefined }, {})).toBe(false);
  });

  it('compares primitives strictly and checks prototypes', () => {
    expect(eq(1, '1')).toBe(false);
    expect(eq(null, {})).toBe(false);
    expect(eq({}, null)).toBe(false);
    expect(eq([], {})).toBe(false);
    class P {}
    expect(eq(new P(), {})).toBe(false);
    expect(eq(NaN, NaN)).toBe(true);
  });

  it('compares symbol keys too', () => {
    const s = Symbol('s');
    expect(eq({ [s]: 1 }, { [s]: 1 })).toBe(true);
    expect(eq({ [s]: 1 }, { [s]: 2 })).toBe(false);
  });

  it('compares Maps by key and deep value', () => {
    expect(eq(new Map([['k', { v: 1 }]]), new Map([['k', { v: 1 }]]))).toBe(true);
    expect(eq(new Map([['k', 1]]), new Map([['k', 2]]))).toBe(false);
    expect(eq(new Map([['k', 1]]), new Map([['j', 1]]))).toBe(false);
    expect(eq(new Map([['k', 1]]), new Map())).toBe(false);
  });

  it('compares Sets by content, including object members', () => {
    expect(eq(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(eq(new Set([1, 2]), new Set([1, 3]))).toBe(false);
    expect(eq(new Set([1]), new Set([1, 2]))).toBe(false);
    expect(eq(new Set([{ a: 1 }, { a: 2 }]), new Set([{ a: 2 }, { a: 1 }]))).toBe(true);
    expect(eq(new Set([{ a: 1 }, { a: 1 }]), new Set([{ a: 1 }, { a: 2 }]))).toBe(false);
    const shared = { a: 1 };
    expect(eq(new Set([shared, { b: 1 }]), new Set([{ b: 1 }, shared]))).toBe(true);
  });

  it('compares RegExps by source and flags', () => {
    expect(eq(/a/g, /a/g)).toBe(true);
    expect(eq(/a/, /b/)).toBe(false);
    expect(eq(/a/g, /a/i)).toBe(false);
  });

  it('formats both sides in the failure message', () => {
    expect(() => assert.deepEqual([1], [2], 'arr')).toThrow('arr: expected [2], got [1]');
    expect(() => assert.deepEqual([1], [2])).toThrow(/^expected \[2\], got \[1\]$/);
  });
});

describe('assert.rejects', () => {
  it('checks the rejection message', async () => {
    await expect(assert.rejects(Promise.reject(new Error('boom')), /boom/)).resolves.toBeUndefined();
    await expect(assert.rejects(Promise.reject(new Error('any')))).resolves.toBeUndefined();
    await expect(assert.rejects(Promise.resolve(1))).rejects.toThrow(/resolved/);
    await expect(assert.rejects(Promise.reject(new Error('x')), /y/)).rejects.toThrow(/expected it to match/);
  });

  it('accepts non-Error rejections and thenables', async () => {
    await expect(assert.rejects(Promise.reject('plain'), /plain/)).resolves.toBeUndefined();
    const thenable = { then: (_: unknown, reject: (e: unknown) => void) => reject(new Error('t')) };
    await expect(assert.rejects(thenable, /t/)).resolves.toBeUndefined();
  });

  it('demands a promise', async () => {
    await expect(assert.rejects(42)).rejects.toThrow('expected a Promise, got 42');
    await expect(assert.rejects(undefined)).rejects.toThrow('expected a Promise, got undefined');
    await expect(assert.rejects({ then: 1 })).rejects.toThrow(/expected a Promise/);
  });
});

describe('fn mock', () => {
  it('records calls and keeps this', () => {
    const m = fn(function (this: { k: number }, n: number) {
      return n * this.k;
    });
    expect(m.call({ k: 3 }, 2)).toBe(6);
    expect(m.calls).toEqual([[2]]);
    expect(m.callCount).toBe(1);
  });

  it('works without an implementation and propagates throws', () => {
    const m = fn();
    expect(m(1, 'a')).toBeUndefined();
    m();
    expect(m.calls).toEqual([[1, 'a'], []]);
    expect(m.callCount).toBe(2);
    const boom = fn(() => {
      throw new Error('boom');
    });
    expect(() => boom()).toThrow('boom');
    expect(boom.callCount).toBe(1);
  });
});
