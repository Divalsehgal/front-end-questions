import { deepEqual } from './solution';

test('primitives (NaN equals NaN)', () => {
  assert.equal(deepEqual(1, 1), true);
  assert.equal(deepEqual('1', 1), false);
  assert.equal(deepEqual(NaN, NaN), true);
  assert.equal(deepEqual(null, undefined), false);
  assert.equal(deepEqual(null, {}), false);
});

test('arrays and objects', () => {
  assert.equal(deepEqual([1, [2, { a: 3 }]], [1, [2, { a: 3 }]]), true);
  assert.equal(deepEqual([1, 2], [1, 2, 3]), false);
  assert.equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true, 'key order must not matter');
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: undefined }), false);
  assert.equal(deepEqual([], {}), false, '[] and {} have different prototypes');
});

test('Date, Map, Set', () => {
  assert.equal(deepEqual(new Date(5), new Date(5)), true);
  assert.equal(deepEqual(new Date(5), new Date(6)), false);
  assert.equal(deepEqual(new Map([['k', { v: 1 }]]), new Map([['k', { v: 1 }]])), true);
  assert.equal(deepEqual(new Map([['k', 1]]), new Map([['k', 2]])), false);
  assert.equal(deepEqual(new Set([1, 2]), new Set([2, 1])), true);
  assert.equal(deepEqual(new Set([1]), new Set([1, 2])), false);
});

test('circular references do not overflow', () => {
  const a: any = { name: 'x' };
  a.self = a;
  const b: any = { name: 'x' };
  b.self = b;
  assert.equal(deepEqual(a, b), true);
  const c: any = { name: 'y' };
  c.self = c;
  assert.equal(deepEqual(a, c), false);
});
