function allConstruct(target, wordBank) {
  const table = Array(target.length + 1)
    .fill()
    .map(() => []);
  table[0] = [[]];
  for (let i = 0; i < target.length; i++) {
    for (let j = 0; j < wordBank.length; j++) {
      if (target.slice(i, i + wordBank[j].length) === wordBank[j]) {
        const newCombination = table[i].map((s) => [...s, wordBank[j]]);
        table[i + wordBank[j].length].push(...newCombination);
      }
    }
  }
  return table[target.length];
}

const target = "abcdef";
const wordBank = ["ab", "abc", "cd", "def", "abcd", "ef", "c"];
console.log(allConstruct(target, wordBank));
