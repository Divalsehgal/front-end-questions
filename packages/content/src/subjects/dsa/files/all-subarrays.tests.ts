import { allSubarrays } from './solution';
test('lists every contiguous subarray in order', () => {
  assert.deepEqual(allSubarrays([1, 2, 3]), [[1], [1, 2], [1, 2, 3], [2], [2, 3], [3]]);
});
test('count is n(n+1)/2', () => {
  assert.equal(allSubarrays([1, 2, 3, 4, 5]).length, 15);
});
test('empty input', () => {
  assert.deepEqual(allSubarrays([]), []);
});
