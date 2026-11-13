/**
 * 09. Product of Array Except Self
 * https://leetcode.com/problems/product-of-array-except-self/
 *
 * Return an array where answer[i] is the product of every element except nums[i].
 * Do not use division.
 *
 * Examples
 *   nums = [1,2,3,4]        ->  [24,12,8,6]
 *   nums = [-1,1,0,-3,3]    ->  [0,0,9,0,0]
 *
 * Target complexity: Time O(n), Space O(1) extra (output array does not count)
 */
import { check } from '../helpers.js';

function productExceptSelf(nums) {
  // your solution
  const temp = []
  for (let i = 0; i < nums.length; i++) {
    temp.push(nums.reduce((acc, d, idx) => idx === i ? acc : acc * d, 1))
  }

  return temp
}

check('example 1', productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
check('with zero', productExceptSelf([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
