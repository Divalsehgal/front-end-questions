/**
 * 08. Subarray Sum Equals K
 * https://leetcode.com/problems/subarray-sum-equals-k/
 *
 * Return how many contiguous subarrays of nums add up to k.
 * nums can contain negative numbers.
 *
 * Examples
 *   nums = [1,1,1], k = 2   ->  2
 *   nums = [1,2,3], k = 3   ->  2   ([1,2] and [3])
 *   nums = [1,-1,0], k = 0  ->  3
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function subarraySum(nums, k) {
  let count=0,temp=0;
  const obj={0:1};
  for(let i=0;i<nums.length;i++){
    temp=temp+nums[i];
    if(obj[temp-k]){
      count=count+obj[temp-k]
    }

    if(obj[temp]){
      obj[temp]++
    }else{
      obj[temp]=1
    }
  }
  return count
  // your solution
}

check('example 1', subarraySum([1, 1, 1], 2), 2);
check('example 2', subarraySum([1, 2, 3], 3), 2);
check('negatives', subarraySum([1, -1, 0], 0), 3);
