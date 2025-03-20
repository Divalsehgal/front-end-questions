function updateInventory(arr1, arr2) {
  let res = {};

  for (const element of arr1) {
    for (let j = 0; j < arr2.length; j++) {
      const common = arr2[j].indexOf(element[1]) === 1;
      if (!common) {
        const second = arr2[j][1];
        if (!res[second]) {
          res[second] = arr2[j];
        }
      } else {
        const temp = [];
        const one = element[0] + arr2[j][0];
        const second = element[1];
        temp.push(one, second);
        res[second] = temp;
      }
    }
    const second = element[1];
    if (!res[second]) {
      res[second] = element;
    }
  }
  const result = Object.values(res)
    .filter((f) => f.length > 0)
    .sort((a, b) => (a[1] > b[1] ? 1 : -1));
  return result;
}

// without using using extra space
// in fcc ask was to use arr1 only to update and returnn as final array .



// Example inventory lists
// var curInv = [
//     [21, "Bowling Ball"],
//     [2, "Dirty Sock"],
//     [1, "Hair Pin"],
//     [5, "Microphone"]
// ];

// var newInv = [
//     [2, "Hair Pin"],
//     [3, "Half-Eaten Apple"],
//     [67, "Bowling Ball"],
//     [7, "Toothpaste"]
// ];

// var curInv = [[]]

// var newInv = [[2, "Hair Pin"], [3, "Half-Eaten Apple"], [67, "Bowling Ball"], [7, "Toothpaste"]]




console.log(updateInventory(
  [
    [21, "Bowling Ball"],
    [2, "Dirty Sock"],
    [1, "Hair Pin"],
    [5, "Microphone"],
  ],
  [
    [2, "Hair Pin"],
    [3, "Half-Eaten Apple"],
    [67, "Bowling Ball"],
    [7, "Toothpaste"],
  ]
))