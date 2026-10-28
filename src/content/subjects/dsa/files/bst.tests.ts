import { BST } from './solution';
const build = (vals: number[]) => {
  const t = new BST();
  vals.forEach((v) => t.insert(v));
  return t;
};
test('insert + has + min/max', () => {
  const t = build([10, 5, 15, 3, 7]);
  assert.equal(t.has(7), true);
  assert.equal(t.has(8), false);
  assert.equal(t.min(), 3);
  assert.equal(t.max(), 15);
  assert.equal(new BST().min(), null);
});
test('traversals', () => {
  const t = build([10, 5, 15, 3, 7, 12]);
  assert.deepEqual(t.inOrder(), [3, 5, 7, 10, 12, 15]);
  assert.deepEqual(t.preOrder(), [10, 5, 3, 7, 15, 12]);
  assert.deepEqual(t.levelOrder(), [[10], [5, 15], [3, 7, 12]]);
});
test('height', () => {
  assert.equal(new BST().height(), 0);
  assert.equal(build([1]).height(), 1);
  assert.equal(build([10, 5, 15, 3]).height(), 3);
});
test('delete leaf, one-child and two-children nodes', () => {
  const t = build([10, 5, 15, 3, 7, 12, 20]);
  t.delete(3);
  t.delete(15);
  t.delete(10);
  assert.deepEqual(t.inOrder(), [5, 7, 12, 20]);
  assert.equal(t.has(10), false);
  t.delete(999);
  assert.deepEqual(t.inOrder(), [5, 7, 12, 20]);
});
