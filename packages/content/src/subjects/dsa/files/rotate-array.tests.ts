import { rotate } from './solution';
test('rotates right in place', () => {
  const nums = [1, 2, 3, 4, 5, 6, 7];
  const ret = rotate(nums, 3);
  assert.deepEqual(nums, [5, 6, 7, 1, 2, 3, 4]);
  assert.equal(ret, undefined);
});
test('k larger than length wraps', () => {
  const nums = [1, 2, 3];
  rotate(nums, 4);
  assert.deepEqual(nums, [3, 1, 2]);
});
test('k = 0 and single element', () => {
  const a = [1, 2];
  rotate(a, 0);
  assert.deepEqual(a, [1, 2]);
  const b = [9];
  rotate(b, 5);
  assert.deepEqual(b, [9]);
});
test('uses O(1) extra space: no new arrays', () => {
  const nums = [1, 2, 3, 4];
  const realSlice = Array.prototype.slice;
  const realSplice = Array.prototype.splice;
  (Array.prototype as any).slice = () => { throw new Error('no slice: reverse in place'); };
  (Array.prototype as any).splice = () => { throw new Error('no splice: reverse in place'); };
  try {
    rotate(nums, 1);
  } finally {
    Array.prototype.slice = realSlice;
    Array.prototype.splice = realSplice;
  }
  assert.deepEqual(nums, [4, 1, 2, 3]);
});
