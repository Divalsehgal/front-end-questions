import { shallowEqual } from './solution';

test('same reference and primitives', () => {
  const o = { a: 1 };
  assert.equal(shallowEqual(o, o), true);
  assert.equal(shallowEqual(1, 1), true);
  assert.equal(shallowEqual(Number.NaN, Number.NaN), true);
  assert.equal(shallowEqual(1, 2), false);
});

test('compares one level deep with Object.is', () => {
  const fn = () => {};
  assert.equal(shallowEqual({ a: 1, fn }, { a: 1, fn }), true);
  assert.equal(shallowEqual({ a: 1 }, { a: 1, b: 2 }), false);
  assert.equal(shallowEqual({ a: { x: 1 } }, { a: { x: 1 } }), false, 'nested objects are compared by reference');
  assert.equal(shallowEqual({ a: () => {} }, { a: () => {} }), false, 'new function each render = not equal');
});

test('null and non-objects', () => {
  assert.equal(shallowEqual(null, null), true);
  assert.equal(shallowEqual(null, {}), false);
  assert.equal(shallowEqual({}, null), false);
});

test('works for arrays too', () => {
  assert.equal(shallowEqual([1, 2], [1, 2]), true);
  assert.equal(shallowEqual([1, 2], [1, 2, 3]), false);
});
