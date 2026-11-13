import { permutations, subsets } from './solution';
test('subsets', () => {
  assert.deepEqual(subsets([1, 2, 3]), [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]);
  assert.deepEqual(subsets([]), [[]]);
  assert.equal(subsets([1, 2, 3, 4, 5]).length, 32);
});
test('permutations', () => {
  assert.deepEqual(permutations([1, 2, 3]), [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]);
  assert.equal(permutations([1, 2, 3, 4]).length, 24);
  assert.deepEqual(permutations([]), [[]]);
});
