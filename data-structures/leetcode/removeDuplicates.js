var removeDuplicates = function (nums) {
  if (nums.length === 0) {
    return 0;
  }

  let k = 2
  for (let i = 2; i < nums.length; i++) {

    if (nums[i] !== nums[k - 2] ) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k;
};

const arr = [0, 0,0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log(removeDuplicates(arr));
console.log(arr)
