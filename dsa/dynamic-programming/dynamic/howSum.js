//HOWSUM

const howSum = (targetSum, array, memo = {}) => {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;
  for (let item of array) {
    const rem = targetSum - item;
    const res = howSum(rem, array, memo);
    if (res !== null) {   // on adding this !res.includes(item) this addition will it make it unique.
      memo[targetSum] = [...res, item];

      return memo[targetSum];
    }
  }
  memo[targetSum] = null;

  return memo[targetSum];
};

console.log(howSum(8, [5, 3, 7, 1]));
console.log(howSum(7, [2,3,6,7]));
