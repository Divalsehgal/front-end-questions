function reverse(nums, l, r) {
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++;
    r--;
  }
  return nums;
}

var rotate = function (nums, k) {
  k = k % nums.length;
  let l = 0,
    r = nums.length - 1;

  nums = reverse(nums, l, r);
  (l = 0), (r = k - 1);

  nums = reverse(nums, l, r);

  (l = k), (r = nums.length - 1);

  nums = reverse(nums, l, r);
};

const nums = [3, 2, 5, 67];

console.log(rotate(nums, 3), nums);
