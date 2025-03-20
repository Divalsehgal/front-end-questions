const canSum = (targetSum, array) => {
  const temp = Array(targetSum + 1).fill(false);
  temp[0] = true;
  for (let i = 0; i <= targetSum; i++) {
    if (temp[i] === true) {
      for (let j of array) {
       temp[i+j]=true
      }
    }
  }
  return temp[targetSum];
};

console.log(canSum(7, [5, 3, 4])); // true
