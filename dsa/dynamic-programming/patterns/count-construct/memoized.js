function countConstruct(target, wordBank,memo={}) {
  let count = 0;
  if(target in memo) return memo[target];
  if (target === "") return 1;
  for (let word of wordBank) {
    if (target.indexOf(word) === 0) {
      const newTarget = target.slice(word.length);
      const result= countConstruct(newTarget, wordBank,memo);
      count += result;
    }
  }
  memo[target] = count;
  return count;
}

console.log(countConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd"]));
