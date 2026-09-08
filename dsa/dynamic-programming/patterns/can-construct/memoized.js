function canConstruct(target, wordBank,memo={}) {
  if (target in memo) return memo[target];
  if (target === "") return true;
  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const remaining = target.slice(word.length);
      if (canConstruct(remaining, wordBank,memo) === true) {
        memo[target]=true
        return true;
      }
    }
  }
   memo[target]=false
  return false;
}

console.log(canConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

console.log(canConstruct("skateboard", ["bo", "rd", "ate", "t", "ska","sk","boar"]));
