const bestSum = (targetSum, array) => {
  let shortestNodes = [];
  const table = Array(targetSum + 1).fill(null);
  table[0] = [];
  for (let i = 0; i < targetSum; i++) {
    if (table[i] !== null) {
      for (let j of array) {
        const combination = [...table[i], j];
        // current combintaion is short then stored it
        if (!table[i + j] || table[i + j].length > combination.length) {
          table[i + j] = combination;
        }
      }
    }
  }
  return table[targetSum];
};

console.log(bestSum(8, [2, 3, 5]));