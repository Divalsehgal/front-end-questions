import { getByPath } from './solution';

const data = { a: { b: [{ c: 1 }, { c: 2, d: null }], 'x-y': 'dash' }, zero: 0 };

test('dot and bracket paths', () => {
  assert.equal(getByPath(data, 'a.b[0].c'), 1);
  assert.equal(getByPath(data, 'a.b[1].c'), 2);
  assert.equal(getByPath(data, 'a.b.1.c'), 2);
});

test('array path', () => {
  assert.equal(getByPath(data, ['a', 'b', 0, 'c']), 1);
  assert.equal(getByPath(data, ['a', 'x-y']), 'dash');
});

test('missing → default, never throws', () => {
  assert.equal(getByPath(data, 'a.nope.deeper'), undefined);
  assert.equal(getByPath(data, 'a.nope.deeper', 'fallback'), 'fallback');
  assert.equal(getByPath(null, 'a.b', 'fallback'), 'fallback');
});

test('falsy values are real values', () => {
  assert.equal(getByPath(data, 'zero', 'fallback'), 0);
  assert.equal(getByPath(data, 'a.b[1].d', 'fallback'), null);
});

test('empty path returns the object', () => {
  assert.equal(getByPath(data, ''), data);
  assert.equal(getByPath(data, []), data);
});
