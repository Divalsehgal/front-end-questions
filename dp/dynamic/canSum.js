//CANSUM

function canSum(targetSum, array, memo = {}) {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return true;
  if (targetSum < 0) return false;
  for (let i = 0; i < array.length; i++) {
    const rem = targetSum - array[i];
    if (canSum(rem, array, memo) === true) {
      memo[targetSum] = true;
      return true;
    }
  }
  memo[targetSum] = false;
  return false;
}

console.log(canSum(7, [2, 4, 2]));
