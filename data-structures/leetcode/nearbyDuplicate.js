var containsNearbyDuplicate = function (nums, k) {
  let obj = {};

  for (let i = 0; i < nums.length; i++) {
    if (!obj[nums[i]]) {
      obj[nums[i]] = [i];
    } else {
      obj[nums[i]] = obj[nums[i]].concat([i]);
    }
  }

  for (let [index, item] of Object.entries(obj)) {
    console.log(index, item);
    if (item.length > 1) {
      if (item.length > 2) {
        for (let i = 0; i < item.length; i++) {
          if (Math.abs(item[i] - item[i + 1]) <= k) {
            return true;
          }
        }
      } else {
        if (Math.abs(item[0] - item[1]) <= k) {
          return true;
        }
      }
    }
  }
  return false;
};

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
