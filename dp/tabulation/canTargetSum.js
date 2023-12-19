function canConstruct(target, wordBank) {
  const temp = Array(target.length + 1).fill(false);
  temp[0] = true;
  for (let i = 0; i < target.length; i++) {
    if (temp[i] === true) {
      for (let j = 0; j < wordBank.length; j++) {
        if (target.slice(i, i + wordBank[j].length) === wordBank[j]) {
          temp[i + wordBank[j].length] = true;
        }
      }
    }
  }
  return temp[target.length];
}

const target = "abcdef";
const wordBank = ["ab", "abc", "cd", "def", "abcd"];
console.log(canConstruct(target, wordBank));
