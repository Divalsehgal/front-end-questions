import { fibMemo, fibTab, gridTraveler } from './solution';
test('small fib', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7].map((n) => fibMemo(n)), [1, 1, 2, 3, 5, 8, 13]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7].map((n) => fibTab(n)), [1, 1, 2, 3, 5, 8, 13]);
});
test("fib(42) and fib(70) are instant (no exponential recursion)", () => {
  const start = Date.now();
  assert.equal(fibMemo(42), 267914296);
  assert.equal(fibTab(70), 190392490709135);
  assert.ok(Date.now() - start < 100, "too slow: cache each n (naive recursion takes ~1s here)");
});
test('fibMemo calls are independent (no shared default memo bugs)', () => {
  assert.equal(fibMemo(10), 55);
  assert.equal(fibMemo(10), 55);
});
test('gridTraveler', () => {
  assert.equal(gridTraveler(1, 1), 1);
  assert.equal(gridTraveler(2, 3), 3);
  assert.equal(gridTraveler(3, 3), 6);
  assert.equal(gridTraveler(0, 5), 0);
  const start = Date.now();
  assert.equal(gridTraveler(16, 16), 155117520);
  assert.ok(Date.now() - start < 100, 'too slow: memoize on (m, n)');
});
