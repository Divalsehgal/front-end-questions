var minimumDifference = function (nums, k) {
  let arr = nums.sort((a,b)=>a-b),
    diff = Infinity,
    temp = 0,
    l = 0,
    r = k - 1;
    console.log(arr)
  while (l < arr.length || r < arr.length) {
    temp = 0;
    temp = arr[r] - arr[l];
    console.log(arr[r], arr[l]);
    if (temp < diff) {
      diff = temp;
    }
    l++;
    r++;
  }
  return diff
};

console.log(minimumDifference([87063,61094,44530,21297,95857,93551,9918], 6));
