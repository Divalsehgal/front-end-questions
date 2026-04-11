// Famous leet code questions
//find out combination of target sum in a array

//words
function AllTargetSum(target, wordBank, memo = {}) {
  let res = []
  if (target in memo) return memo[target]
  if (target === "") return [[]];
  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const newTarget = target.slice(word.length);
      const result = AllTargetSum(newTarget, wordBank, memo)
      const temp = result?.map(f => [...f, word])
      res.push(...temp)
    }
  }
  memo[target] = res
  return res

}

// numbers
function allTargetSumN(target, numbers, memo = {}) {
  let res = [];
  if (target in memo) return memo[target];
  if (target === 0) return [[]];
  if (target < 0) return [];

  for (let num of numbers) {
    const remainder = target - num;
    const result = allTargetSumN(remainder, numbers, memo);
    const temp = result.map((arr) => [...arr, num].sort((a, b) => a - b)); // Sort the combination
    temp.forEach(combination => {
      const combinationString = combination.join(',');
      if (!res.some(arr => arr.join(',') === combinationString)) {
        res.push(combination);
      }
    });
  }

  memo[target] = res;
  return res;
}


console.log(AllTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

console.log(AllTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

console.log(AllTargetSum("purple", ["purp", "p", "ur", "le", "purpl"]));

console.log(allTargetSumN(7, [2, 3, 6, 7]));


