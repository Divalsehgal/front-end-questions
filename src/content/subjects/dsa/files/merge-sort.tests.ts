import { mergeSort, mergeSorted } from './solution';
const cases: number[][] = [[], [1], [2, 1], [5, 2, 4, 6, 1, 3], [3, 3, 1, 2, 2], [-1, 10, -20, 0, 5], Array.from({ length: 200 }, (_, i) => (i * 7919) % 211)];
const sorted = (a: number[]) => [...a].sort((x, y) => x - y);
test('mergeSorted', () => {
  assert.deepEqual(mergeSorted([1, 3, 5], [2, 4, 6, 8]), [1, 2, 3, 4, 5, 6, 8]);
  assert.deepEqual(mergeSorted([], [1]), [1]);
});
test('mergeSort sorts without Array.prototype.sort', () => {
  const real = Array.prototype.sort;
  for (const c of cases) {
    const expected = sorted(c);
    Array.prototype.sort = () => { throw new Error('Array.prototype.sort is disabled'); };
    let out: number[];
    try {
      out = mergeSort(c);
    } finally {
      Array.prototype.sort = real;
    }
    assert.deepEqual(out, expected);
  }
});
test('handles 100k items quickly', () => {
  const big = Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100003);
  const start = Date.now();
  mergeSort(big);
  assert.ok(Date.now() - start < 2000, 'too slow for O(n log n)');
});
