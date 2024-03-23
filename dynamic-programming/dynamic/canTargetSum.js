function canTargetSum(target, wordBank,memo={}) {
  if (target in memo) return memo[target];
  if (target === "") return true;
  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const remaining = target.slice(word.length);
       memo[target]=true
      if (canTargetSum(remaining, wordBank,memo) === true) {
        return true;
      }
    }
  }
   memo[target]=false
  return false;
}

console.log(canTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

console.log(canTargetSum("skateboard", ["bo", "rd", "ate", "t", "ska","sk","boar"]));
