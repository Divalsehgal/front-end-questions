/**
 * 04. 3Sum
 * https://leetcode.com/problems/3sum/
 *
 * Return every unique triplet [a, b, c] from nums where a + b + c = 0.
 * The result must not contain duplicate triplets. Order does not matter.
 *
 * Examples
 *   nums = [-1,0,1,2,-1,-4]  ->  [[-1,-1,2],[-1,0,1]]
 *   nums = [0,1,1]           ->  []
 *   nums = [0,0,0]           ->  [[0,0,0]]
 *
 * Target complexity: Time O(n^2), Space O(1) extra (ignoring sort and output)
 */
import { check, unordered } from '../helpers.js';

function threeSum(nums) {
  // your solution
  nums.sort((a,b)=>a-b);
  const obj={},temp=[]

  for(let i=0;i<nums.length;i++){
    let left=i+1,right=nums.length-1
        while(left<right){
          const sum=nums[i]+nums[l]+nums[r]
          if(sum===0){
            obj[`${nums[i]}.${nums[l]}.${nums[r]}`]=[nums[i],nums[l],nums[r]];
            left++;
            right--;
          }else if(sum<0){
                right--;
          }else{
            left++
          }
        }
  }

  return Object.values(nums)

}

check('example 1', unordered(threeSum([-1, 0, 1, 2, -1, -4])), unordered([[-1, -1, 2], [-1, 0, 1]]));
check('example 2', unordered(threeSum([0, 1, 1])), []);
check('example 3', unordered(threeSum([0, 0, 0])), [[0, 0, 0]]);
