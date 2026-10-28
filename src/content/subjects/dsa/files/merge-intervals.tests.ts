import { merge } from './solution';
test('merges overlaps', () => {
  assert.deepEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
});
test('touching intervals merge; contained ones disappear', () => {
  assert.deepEqual(merge([[1, 4], [4, 5]]), [[1, 5]]);
  assert.deepEqual(merge([[1, 4], [2, 3]]), [[1, 4]]);
});
test('unsorted input', () => {
  assert.deepEqual(merge([[8, 10], [1, 3], [2, 6]]), [[1, 6], [8, 10]]);
});
test('does not mutate the input', () => {
  const input: [number, number][] = [[3, 4], [1, 2]];
  merge(input);
  assert.deepEqual(input, [[3, 4], [1, 2]]);
});
test('empty', () => {
  assert.deepEqual(merge([]), []);
});
