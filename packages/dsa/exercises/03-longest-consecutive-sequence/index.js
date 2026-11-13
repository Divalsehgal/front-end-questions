/**
 * 03. Longest Consecutive Sequence
 * https://leetcode.com/problems/longest-consecutive-sequence/
 *
 * Given an unsorted array of integers, return the length of the longest run of
 * consecutive values (they do not need to be next to each other in the array).
 * Must run in O(n).
 *
 * Examples
 *   nums = [100,4,200,1,3,2]            ->  4   (1, 2, 3, 4)
 *   nums = [0,3,7,2,5,8,4,6,0,1]        ->  9
 *   nums = []                           ->  0
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function longestConsecutive(nums) {
  nums.sort((a,b)=>a-b) //[1,2,3,4,100,200];
  let count=1;
  let res=1;
  let max=1;
  if (nums.length === 0) return 0
  for(let i=0;i<nums.length;i++){
    
    if(nums[i]===nums[i+1]){
      continue;
    }
    if(nums[i]+1===nums[i+1]){
      count++
    }else{
      count=1;
    }
    max=Math.max(count,max)
  }
  return max
  // your solution
}

check('example 1', longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
check('example 2', longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
check('empty', longestConsecutive([]), 0);
