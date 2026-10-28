import { coinChange, lengthOfLIS, maxProfit, rob } from './solution';
test('rob', () => {
  assert.equal(rob([1, 2, 3, 1]), 4);
  assert.equal(rob([2, 7, 9, 3, 1]), 12);
  assert.equal(rob([]), 0);
  assert.equal(rob([2, 1, 1, 2]), 4);
});
test('maxProfit', () => {
  assert.equal(maxProfit([7, 1, 5, 3, 6, 4]), 5);
  assert.equal(maxProfit([7, 6, 4, 3, 1]), 0);
});
test('coinChange', () => {
  assert.equal(coinChange([1, 2, 5], 11), 3);
  assert.equal(coinChange([2], 3), -1);
  assert.equal(coinChange([1], 0), 0);
  assert.equal(coinChange([186, 419, 83, 408], 6249), 20);
});
test('lengthOfLIS', () => {
  assert.equal(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  assert.equal(lengthOfLIS([0, 1, 0, 3, 2, 3]), 4);
  assert.equal(lengthOfLIS([7, 7, 7]), 1);
});
