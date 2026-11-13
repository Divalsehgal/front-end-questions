import { isPalindrome, maxArea, moveZeroes, removeDuplicates, removeElement } from './solution';
test('removeElement', () => {
  const nums = [0, 1, 2, 2, 3, 0, 4, 2];
  const k = removeElement(nums, 2);
  assert.equal(k, 5);
  assert.deepEqual(nums.slice(0, k).sort(), [0, 0, 1, 3, 4]);
});
test('removeDuplicates', () => {
  const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
  const k = removeDuplicates(nums);
  assert.equal(k, 5);
  assert.deepEqual(nums.slice(0, k), [0, 1, 2, 3, 4]);
  assert.equal(removeDuplicates([]), 0);
});
test('moveZeroes keeps order', () => {
  const nums = [0, 1, 0, 3, 12];
  moveZeroes(nums);
  assert.deepEqual(nums, [1, 3, 12, 0, 0]);
});
test('isPalindrome ignores case and punctuation', () => {
  assert.equal(isPalindrome('A man, a plan, a canal: Panama'), true);
  assert.equal(isPalindrome('race a car'), false);
  assert.equal(isPalindrome(' '), true);
  assert.equal(isPalindrome('0P'), false);
});
test('maxArea', () => {
  assert.equal(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
  assert.equal(maxArea([1, 1]), 1);
});
