function countConstruct(target, wordBank) {
  const table = Array(target.length + 1).fill(0);
  table[0] = 1;
  for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < wordBank.length; j++) {
        if (target.slice(i, i + wordBank[j].length) === wordBank[j])
          table[i + wordBank[j].length] += table[i];
      }

  }
  console.log(table);
  return table[target.length];
}

const target = "purple";
const wordBank = ["purp", "p", "ur", "le", "purpl"];
console.log(countConstruct(target, wordBank));
