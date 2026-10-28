import { bestSum, canSum, howSum } from './solution';
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
test('canSum', () => {
  assert.equal(canSum(7, [2, 3]), true);
  assert.equal(canSum(7, [2, 4]), false);
  assert.equal(canSum(0, [1]), true);
});
test('howSum returns a valid combination', () => {
  const r = howSum(7, [5, 3, 4, 7])!;
  assert.equal(sum(r), 7);
  assert.ok(r.every((n) => [5, 3, 4, 7].includes(n)));
  assert.equal(howSum(7, [2, 4]), null);
});
test('bestSum returns the shortest', () => {
  assert.deepEqual(bestSum(7, [5, 3, 4, 7]), [7]);
  assert.equal(bestSum(8, [2, 3, 5])!.length, 2);
  assert.equal(bestSum(8, [1, 4, 5])!.length, 2);
  assert.equal(bestSum(25, [1, 2, 5, 25])!.length, 1);
  assert.equal(bestSum(7, [2, 4]), null);
});
test('memoized: large targets are fast', () => {
  const start = Date.now();
  // 246 isn't reachable with 7s and 14s; without a memo each call explores ~10⁷ paths (about a second).
  assert.equal(canSum(246, [7, 14]), false);
  assert.equal(howSum(246, [7, 14]), null);
  assert.equal(bestSum(246, [7, 14]), null);
  assert.ok(Date.now() - start < 150, 'too slow: memoize on the remaining target');
});
