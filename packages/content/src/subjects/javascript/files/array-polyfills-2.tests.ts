import { at, every, fill, find, findIndex, some } from './solution';
const ban = (names: string[]) => {
  const saved = names.map((n) => [n, (Array.prototype as any)[n]] as const);
  names.forEach((n) => ((Array.prototype as any)[n] = () => { throw new Error(`native ${n} is disabled`); }));
  return () => saved.forEach(([n, f]) => ((Array.prototype as any)[n] = f));
};
test('at', () => {
  const restore = ban(['at']);
  try {
    assert.equal(at([1, 2, 3], 0), 1);
    assert.equal(at([1, 2, 3], -1), 3);
    assert.equal(at([1, 2, 3], -4), undefined);
    assert.equal(at([1, 2, 3], 5), undefined);
  } finally {
    restore();
  }
});
test('find and findIndex', () => {
  const restore = ban(['find', 'findIndex']);
  try {
    assert.equal(find([5, 12, 8, 130], (x) => x > 10), 12);
    assert.equal(find([1, 2], (x) => x > 10), undefined);
    assert.equal(findIndex([5, 12, 8, 130], (x) => x > 10), 1);
    assert.equal(findIndex([1, 2], (x) => x > 10), -1);
  } finally {
    restore();
  }
});
test('every and some short-circuit', () => {
  const restore = ban(['every', 'some']);
  try {
    let calls = 0;
    assert.equal(every([1, 2, 3, 4], (x) => (calls++, x < 2)), false);
    assert.equal(calls, 2);
    assert.equal(every([], () => false), true);
    calls = 0;
    assert.equal(some([1, 2, 3, 4], (x) => (calls++, x === 2)), true);
    assert.equal(calls, 2);
    assert.equal(some([], () => true), false);
  } finally {
    restore();
  }
});
test('fill', () => {
  const restore = ban(['fill']);
  try {
    const a = [1, 2, 3, 4];
    assert.equal(fill(a, 0, 1, 3), a);
    assert.deepEqual(a, [1, 0, 0, 4]);
    assert.deepEqual(fill([1, 2, 3], 9, -2), [1, 9, 9]);
    assert.deepEqual(fill([1, 2, 3], 7), [7, 7, 7]);
  } finally {
    restore();
  }
});
