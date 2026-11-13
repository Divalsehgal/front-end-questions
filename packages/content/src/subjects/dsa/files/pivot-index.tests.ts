import { pivotIndex } from './solution';
test('examples', () => {
  assert.equal(pivotIndex([1, 7, 3, 6, 5, 6]), 3);
  assert.equal(pivotIndex([1, 2, 3]), -1);
  assert.equal(pivotIndex([2, 1, -1]), 0);
});
test('negatives and the leftmost answer', () => {
  assert.equal(pivotIndex([-1, -1, -1, -1, -1, 0]), 2);
  assert.equal(pivotIndex([0, 0, 0]), 0);
});
