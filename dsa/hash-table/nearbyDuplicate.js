var containsNearbyDuplicate = function (nums, k) {
  let set = new Set();

  for (let i = 0; i < nums.length; i++) {
    if (set.has(nums[i])) {
      return true;
    } else {
      set.add(nums[i]);
      if (set.size > k) return set.delete(nums[i-k]);
    }
  }
  return false
};

console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 5));
