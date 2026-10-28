import { subarrayWithSum } from './solution';
test('handles negatives', () => {
  assert.deepEqual(subarrayWithSum([-4, -3, 5, -1, -2, 1, 6, -3, -1], 9), [5, -1, -2, 1, 6]);
});
test('positives', () => {
  assert.deepEqual(subarrayWithSum([1, 4, 20, 3, 10, 5], 33), [20, 3, 10]);
});
test('no answer', () => {
  assert.equal(subarrayWithSum([1, 2, 3], 7), null);
});
test('whole array and single element', () => {
  assert.deepEqual(subarrayWithSum([2, 2], 4), [2, 2]);
  assert.deepEqual(subarrayWithSum([5, 1], 1), [1]);
});
