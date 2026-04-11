const bestSum = (targetSum, array, memo = {}) => {
  let shortestNodes = null;
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;
  for (let item of array) {
    const rem = targetSum - item;
    const res = bestSum(rem, array, memo);
    if (res !== null) {
      //  !res.includes(item) this addition will it make it unique.
      const combination = [...res, item];
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
