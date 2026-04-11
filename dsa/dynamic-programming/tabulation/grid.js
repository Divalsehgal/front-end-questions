// GRID TABULATION

// [
//   [s, "", ""],
//   ["", "", ""],
//   ["", "", "e"],
// ];

//1st path
//R R D D
//[{0,0} ,{0,1},{ 0,2 }, {1,2},{2,2}]

//DATE 25-August-2023
/*
First think of 2 d array (matrix)
Now then try to thinkof pattern
find base case 
then try to reduce
find the pattern dry run 
simulate through console
add the condition
check for bounds
check for condition
*/

const gridTraveller = (a, b) => {
  const table = Array(a + 1)
    .fill()
    ?.map(() => Array(b + 1).fill(0));

  table[1][1] = 1;
  for (let i = 0; i <= a; i++) {
    for (let j = 0; j <= b; j++) {
      const current = table[i][j];
      if (j + 1 <= b) table[i][j + 1] += current;
      if (i + 1 <= a) table[i + 1][j] += current;
    }
  }
  return table[a][b];
};

console.log(gridTraveller(3, 2));
console.log(gridTraveller(3, 3)); //6

console.log(gridTraveller(40, 10));
