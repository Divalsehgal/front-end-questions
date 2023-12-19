const howSum = (targetSum, array) => {
  const table = Array(targetSum + 1).fill(null);
  table[0] = [];
  for (let i = 0; i <= targetSum; i++) {
    if (table[i] !== null) {
      for (let j of array) {
        table[i + j] = [...table[i], j];
      }
    }
  }
  return table[targetSum];
};
console.log(howSum(7, [5, 3, 4]));

console.log(howSum(7, [2, 3]));
