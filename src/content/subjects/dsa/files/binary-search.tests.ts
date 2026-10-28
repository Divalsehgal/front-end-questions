import { binarySearch, binarySearchRecursive, lowerBound } from './solution';
const arr = [-5, 2, 4, 6, 10, 15];
test('finds every element', () => {
  arr.forEach((x, i) => {
    assert.equal(binarySearch(arr, x), i);
    assert.equal(binarySearchRecursive(arr, x), i);
  });
});
test('missing values return -1', () => {
  for (const x of [-10, 3, 20]) {
    assert.equal(binarySearch(arr, x), -1);
    assert.equal(binarySearchRecursive(arr, x), -1);
  }
  assert.equal(binarySearch([], 1), -1);
});
test('lowerBound', () => {
  assert.equal(lowerBound([1, 3, 5, 6], 5), 2);
  assert.equal(lowerBound([1, 3, 5, 6], 2), 1);
  assert.equal(lowerBound([1, 3, 5, 6], 7), 4);
  assert.equal(lowerBound([1, 2, 2, 2, 3], 2), 1);
});
test('is O(log n): touches few elements', () => {
  let reads = 0;
  const big = new Proxy(Array.from({ length: 1 << 20 }, (_, i) => i), {
    get(t, k) {
      if (typeof k === 'string' && /^\d+$/.test(k)) reads++;
      return Reflect.get(t, k);
    },
  });
  binarySearch(big as number[], 123456);
  assert.ok(reads <= 40, `read ${reads} elements; binary search on 1M items needs ~20`);
});
