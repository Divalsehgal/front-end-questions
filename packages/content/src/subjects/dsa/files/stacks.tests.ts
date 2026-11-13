import { dailyTemperatures, isValidParentheses, nextGreaterElement } from './solution';
test('isValidParentheses', () => {
  assert.equal(isValidParentheses('()[]{}'), true);
  assert.equal(isValidParentheses('{[()]}'), true);
  assert.equal(isValidParentheses('(]'), false);
  assert.equal(isValidParentheses('([)]'), false);
  assert.equal(isValidParentheses('(('), false);
  assert.equal(isValidParentheses(')'), false);
});
test('nextGreaterElement', () => {
  assert.deepEqual(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), [-1, 3, -1]);
  assert.deepEqual(nextGreaterElement([2, 4], [1, 2, 3, 4]), [3, -1]);
});
test('dailyTemperatures', () => {
  assert.deepEqual(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
  assert.deepEqual(dailyTemperatures([30, 60, 90]), [1, 1, 0]);
});
test('dailyTemperatures is O(n) (monotonic stack)', () => {
  const desc = Array.from({ length: 50000 }, (_, i) => 50000 - i);
  const start = Date.now();
  dailyTemperatures(desc);
  assert.ok(Date.now() - start < 150, 'too slow: use a monotonic stack');
});
