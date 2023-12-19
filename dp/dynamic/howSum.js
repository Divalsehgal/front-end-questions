HOWSUM

const howSum = (targetSum, array, memo = {}) => {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;
  for (let i = 0; i < array.length; i++) {
    const rem = targetSum - array[i];
    const res = howSum(rem, array, memo);
    if (res !== null) {
      //  !res.includes(array[i]) this addition will it make it unique.
      memo[targetSum] = [...res, array[i]];

      return memo[targetSum];
    }
  }
  memo[targetSum] = null;

  return memo[targetSum];
};

console.log(howSum(8, [5, 3, 7, 1]));
