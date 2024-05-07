var pivotIndex = function (nums) {
  let i = 0,
    j = nums.length - 1,
    s1 = 0;
   const sum= nums.reduce((acc,d)=>acc+d,0);
   const mid=Math.ceil(sum/2);
   while(s1!==mid){
    s1+=nums[i];
    i++
   }
   console.log(i)
};

const nums = [-1, -1, -1, -1, -1, 0];
console.log(pivotIndex(nums));
