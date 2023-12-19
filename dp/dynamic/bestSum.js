const bestSum = (targetSum, array, memo = {}) => {
  let shortestNodes = null;
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;
  for (let i = 0; i < array.length; i++) {
    const rem = targetSum - array[i];
    const res = bestSum(rem, array, memo);
    if (res !== null) {
      //  !res.includes(array[i]) this addition will it make it unique.
      const combination = [...res, array[i]];
      // if the current combination is shortest with the current then need to update
      if (shortestNodes === null || combination.length < shortestNodes.length) {
        shortestNodes = combination;
      }
    }
  }
  memo[targetSum] = shortestNodes;
  return memo[targetSum];
};

console.log(bestSum(8, [5, 3, 7, 1]));
