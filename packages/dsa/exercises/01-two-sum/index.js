/**
 * 01. Two Sum
 * https://leetcode.com/problems/two-sum/
 *
 * Given an array of integers nums and an integer target, return the indices of
 * the two numbers that add up to target.
 * Exactly one answer exists. You may not use the same element twice.
 *
 * Examples
 *   nums = [2,7,11,15], target = 9  ->  [0,1]
 *   nums = [3,2,4], target = 6       ->  [1,2]
 *   nums = [3,3], target = 6         ->  [0,1]
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function twoSum(nums, target) {
  // your solution
  const obj={};
  for(let i=0;i<nums.length;i++){
    const rem=target-nums[i];
    if(rem in obj){
      return [obj[rem],i]
    }
    obj[nums[i]]=i
  }
  return -1
}

check('example 1', twoSum([2, 7, 11, 15], 9), [0, 1]);
check('example 2', twoSum([3, 2, 4], 6), [1, 2]);
check('example 3', twoSum([3, 3], 6), [0, 1]);
