import { threeSum } from './solution';
test('example', () => {
  assert.deepEqual(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
});
test('no duplicates in the output', () => {
  assert.deepEqual(threeSum([0, 0, 0, 0]), [[0, 0, 0]]);
  assert.deepEqual(threeSum([-2, 0, 0, 2, 2]), [[-2, 0, 2]]);
});
test('no answer', () => {
  assert.deepEqual(threeSum([0, 1, 1]), []);
});
test('is O(n²), not O(n³)', () => {
  const big = Array.from({ length: 1600 }, (_, i) => (i % 2 ? i : -i));
  const start = Date.now();
  threeSum(big);
  assert.ok(Date.now() - start < 150, 'too slow for 1600 numbers: use sort + two pointers');
});
