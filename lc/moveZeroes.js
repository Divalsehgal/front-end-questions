var moveZeroes = function (nums) {
  function swap(a, b, prices) {
    let temp;
    temp = prices[a];
    prices[a] = prices[b];
    prices[b] = temp;
  }
  let i = 0,
    j = 0;
  while (j < nums.length) {
    if (nums[i] === 0) {
      swap(i, j, nums);
      j++;
    } else {
      i++;
    }
  }
};

console.log(moveZeroes([2, 1, 4,0]));
