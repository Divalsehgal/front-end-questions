import { generateSpiral, spiralOrder } from './solution';
test('generateSpiral(3)', () => {
  assert.deepEqual(generateSpiral(3), [[1, 2, 3], [8, 9, 4], [7, 6, 5]]);
});
test('generateSpiral(4) and (1)', () => {
  assert.deepEqual(generateSpiral(4), [[1, 2, 3, 4], [12, 13, 14, 5], [11, 16, 15, 6], [10, 9, 8, 7]]);
  assert.deepEqual(generateSpiral(1), [[1]]);
});
test('spiralOrder on non-square matrices', () => {
  assert.deepEqual(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
  assert.deepEqual(spiralOrder([[1], [2], [3]]), [1, 2, 3]);
  assert.deepEqual(spiralOrder([]), []);
});
