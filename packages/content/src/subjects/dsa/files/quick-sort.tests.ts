import { quickSort } from './solution';
const cases: number[][] = [[], [1], [2, 1], [5, 2, 4, 6, 1, 3], [3, 3, 1, 2, 2], [-1, 10, -20, 0, 5], Array.from({ length: 200 }, (_, i) => (i * 7919) % 211)];
const sorted = (a: number[]) => [...a].sort((x, y) => x - y);
test('sorts in place and returns the same array', () => {
  const real = Array.prototype.sort;
  for (const c of cases) {
    const input = [...c];
    Array.prototype.sort = () => { throw new Error('Array.prototype.sort is disabled'); };
    let out: number[];
    try {
      out = quickSort(input);
    } finally {
      Array.prototype.sort = real;
    }
    assert.equal(out, input);
    assert.deepEqual(input, sorted(c));
  }
});
test('already-sorted input does not blow the stack (pick a good pivot)', () => {
  const big = Array.from({ length: 20000 }, (_, i) => i);
  quickSort(big);
  assert.equal(big[19999], 19999);
});
