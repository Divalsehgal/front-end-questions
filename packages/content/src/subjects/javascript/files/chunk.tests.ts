import { chunk } from './solution';

test('splits into groups of size', () => {
  assert.deepEqual(chunk(['a', 'b', 'c', 'd'], 2), [['a', 'b'], ['c', 'd']]);
});

test('the last chunk holds the remainder', () => {
  assert.deepEqual(chunk(['a', 'b', 'c', 'd'], 3), [['a', 'b', 'c'], ['d']]);
});

test('default size is 1', () => {
  assert.deepEqual(chunk([1, 2, 3]), [[1], [2], [3]]);
});

test('a size below 1 returns []', () => {
  assert.deepEqual(chunk([1, 2], 0), []);
});

test('empty input and oversized chunks', () => {
  assert.deepEqual(chunk([], 2), []);
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);
});

test('does not mutate the input', () => {
  const input = [1, 2, 3];
  chunk(input, 2);
  assert.deepEqual(input, [1, 2, 3]);
});
