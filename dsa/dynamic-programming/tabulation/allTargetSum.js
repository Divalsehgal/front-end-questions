// for strings
function allConstructS(target, wordBank) {
  const table = Array(target.length + 1)
    .fill()
    .map(() => []);
  table[0] = [[]];
  for (let i = 0; i < target.length; i++) {
    for (let word of wordBank) {
      if (target.slice(i, i + word.length) === word) {
        const newCombination = table[i].map((s) => [...s, word]);
        table[i + word.length].push(...newCombination);
      }
    }
  }
  return table[target.length];
}

// for numbers
function allConstructN(target, wordBank) {
  const table = Array(target + 1)
    .fill()
    .map(() => []);
  table[0] = [[]];
  for (let i = 0; i <= target; i++) {
    for (let word of wordBank) {
      if (i + word <= target) {
        const newCombination = table[i].map((arr) => [...arr, word]);
        newCombination.forEach((arr) => arr.sort((a, b) => a - b)); // Sort the combination
        table[i + word].push(...newCombination);
      }
    }
  }
  const result = [];
  table[target].forEach((arr) => {
    // Check if the combination already exists in the result array
    if (!result.some((a) => JSON.stringify(a) === JSON.stringify(arr))) {
      result.push(arr);
    }
  });
  return result;
}


const target = "abcdef";
const wordBank = ["ab", "abc", "cd", "def", "abcd", "ef", "c"];
console.log(allConstructN(7, [2, 3, 6, 7]));
console.log(allConstructS(target, wordBank));
