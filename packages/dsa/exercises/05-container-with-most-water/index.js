/**
 * 05. Container With Most Water
 * https://leetcode.com/problems/container-with-most-water/
 *
 * height[i] is the height of a vertical line at position i.
 * Pick two lines that, with the x-axis, hold the most water. Return that amount.
 *
 * Examples
 *   height = [1,8,6,2,5,4,8,3,7]  ->  49
 *   height = [1,1]                ->  1
 *
 * Target complexity: Time O(n), Space O(1)
 */
import { check } from '../helpers.js';

function maxArea(height) {
  let max=0;
  let left=0,right=height.length-1

  while(left<right){
    const water=(right-left)*Math.min(height[left],height[right]);
    max=Math.max(water,max)

    if(height[left]<height[right]){
      left++;
    }else{
      right--
    }

  }

  return max


  // your solution
}

check('example 1', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
check('example 2', maxArea([1, 1]), 1);
