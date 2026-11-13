/**
 * 14. Find Peak Element
 * https://leetcode.com/problems/find-peak-element/
 *
 * A peak is an element strictly greater than its neighbours.
 * Treat nums[-1] and nums[n] as -Infinity. Neighbours are never equal.
 * Return the index of any peak. Must run in O(log n).
 *
 * Examples
 *   nums = [1,2,3,1]          ->  2
 *   nums = [1,2,1,3,5,6,4]    ->  1 or 5
 * [1,2,3,6]
 * Target complexity: Time O(log n), Space O(1)
 */
import { check } from '../helpers.js';

function findPeakElement(nums) {
  let left=0;right=nums.length-1;
  while(left<right){
    const mid=left+Math.floor((right-left)/2)
    if(nums[mid]<nums[mid+1]){
      left=mid+1
    }else{
      right=mide
    }
  }
  return -1
  // your solution
}


// any peak is accepted, so check the returned index is a peak
const isPeak = (nums, i) =>
  i >= 0 && i < nums.length && (i === 0 || nums[i] > nums[i - 1]) && (i === nums.length - 1 || nums[i] > nums[i + 1]);

check('example 1', isPeak([1, 2, 3, 1], findPeakElement([1, 2, 3, 1])), true);
check('example 2', isPeak([1, 2, 1, 3, 5, 6, 4], findPeakElement([1, 2, 1, 3, 5, 6, 4])), true);
check('single', findPeakElement([5]), 0);
