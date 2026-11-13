import { bubbleSort, insertionSort, selectionSort } from './solution';
const cases: number[][] = [[], [1], [2, 1], [5, 2, 4, 6, 1, 3], [3, 3, 1, 2, 2], [-1, 10, -20, 0, 5], Array.from({ length: 200 }, (_, i) => (i * 7919) % 211)];
const sorted = (a: number[]) => [...a].sort((x, y) => x - y);
const realSort = Array.prototype.sort;
for (const [name, fn] of [['bubble', bubbleSort], ['selection', selectionSort], ['insertion', insertionSort]] as const) {
  test(`${name} sort`, () => {
    for (const c of cases) {
      const expected = sorted(c);
      const copy = [...c];
      Array.prototype.sort = () => { throw new Error('Array.prototype.sort is disabled'); };
      let out: number[];
      try {
        out = fn(c);
      } finally {
        Array.prototype.sort = realSort;
      }
      assert.deepEqual(out, expected);
      assert.deepEqual(c, copy, 'input was mutated');
    }
  });
}
