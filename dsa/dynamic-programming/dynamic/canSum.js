//CANSUM
// Whether we can create target sum from given array 

function canSum(targetSum, array, memo = {}) {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return true;
  if (targetSum < 0) return false;
  for (let item of array) {
    const rem = targetSum - item;
    if (canSum(rem, array, memo) === true) {
      memo[targetSum] = true;
      return true;
    }
  }
  memo[targetSum] = false;
  return false;
}

console.log(canSum(7, [2, 4, 2]));
