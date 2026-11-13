/**
 * 15. Search in Rotated Sorted Array
 * https://leetcode.com/problems/search-in-rotated-sorted-array/
 *
 * nums is sorted ascending with distinct values, then rotated at an unknown index.
 * Return the index of target, or -1. Must run in O(log n).
 *
 * Examples
 *   nums = [4,5,6,7,0,1,2], target = 0  ->  4
 *   nums = [4,5,6,7,0,1,2], target = 3  ->  -1
 *   nums = [1], target = 0              ->  -1
 *
 * Target complexity: Time O(log n), Space O(1)
 */
import { check } from '../helpers.js';

function search(nums, target) {
  // your solution
  let left=0,right=nums.length-1;

  while(left<=right){
    
    const mid=left+Math.floor((right-left)/2);
    if(nums[mid]<nums[right]){
      right=mid;
    }else{
    left=mid+1
    }
  }

  let pivot=left

  if(pivot===0){
    left=0;
    right=nums.length-1;
  }else if(nums[i]<target){
    left=0;
    right=pivot-1;
    
  }else{
    left=pivot;
    right=nums.length-1
  }



  while(left<right){
    
  }

}

check('example 1', search([4, 5, 6, 7, 0, 1, 2], 0), 4);
check('example 2', search([4, 5, 6, 7, 0, 1, 2], 3), -1);
check('single', search([1], 0), -1);
check('left half', search([4, 5, 6, 7, 0, 1, 2], 5), 1);
