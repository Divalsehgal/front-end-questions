//House Robber Qestion Dynamic Programming

var rob = function (nums) {

  if (nums.length == 1) return nums[0];
  if (nums.length == 2) return Math.max(nums[0], nums[1]);

  let second = Math.max(nums[0], nums[1]);
  let first = nums[0],
    current;

  for (let i = 2; i < nums.length; i++) {
    current = Math.max(second, first + nums[i]);
    first = second;
    second = current;
  }
  return current;
};

const arr = [2, 7, 9, 3, 1];
console.log(rob(arr))
