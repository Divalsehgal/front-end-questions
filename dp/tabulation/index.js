//DATE 23-AUGUST-23

// FIB TABULATION

// const fib=(n)=>{
// let temp=[];
// for(let i=0; i<=n; i++){
//   if(i==0 || i==1){
//     temp.push(i)
//   }else{
//     temp[i]=temp[i-1]+temp[i-2]
//   }
// }
// return temp[n]
// }

// console.log(fib(6));

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

// const gridTraveller = (a, b) => {
//   const table = Array(a + 1)
//     .fill()
//     ?.map(() => Array(b + 1).fill(0));

//   table[1][1] = 1;
//   for (let i = 0; i <= a; i++) {
//     for (let j = 0; j <= b; j++) {
//       const current = table[i][j];
//       if (j + 1 <= b) table[i][j + 1] += current;
//       if (i + 1 <= a) table[i + 1][j] += current;
//     }
//   }
//   return table[a][b];
// };

// console.log(gridTraveller(3, 2));
// console.log(gridTraveller(3, 3)); //6

// console.log(gridTraveller(40, 10));

// const canSum = (targetSum, array) => {
//   const temp = Array(targetSum + 1).fill(false);
//   temp[0] = true;
//   for (let i = 0; i <= targetSum; i++) {
//     if (temp[i] === true) {
//       for (let j of array) {
//        temp[i+j]=true
//       }
//     }
//   }
//   return temp[targetSum];
// };

// console.log(canSum(7, [5, 3, 4])); // true

// const howSum = (targetSum, array) => {
//   const table = Array(targetSum + 1).fill(null);
//   table[0] = [];
//   for (let i = 0; i <= targetSum; i++) {
//     if (table[i] !== null) {
//       for (let j of array) {
//         table[i + j] = [...table[i], j];
//       }
//     }
//   }
//   return table[targetSum];
// };
// console.log(howSum(7, [5, 3, 4]));

// console.log(howSum(7, [2, 3]));

// const bestSum = (targetSum, array) => {
//   let shortestNodes = [];
//   const table = Array(targetSum + 1).fill(null);
//   table[0] = [];
//   for (let i = 0; i < targetSum; i++) {
//     if (table[i] !== null) {
//       for (let j of array) {
//         const combination = [...table[i], j];
//         // current combintaion is short then stored it
//         if (!table[i + j] || table[i + j].length > combination.length) {
//           table[i + j] = combination;
//         }
//       }
//     }
//   }
//   return table[targetSum];
// };

// console.log(bestSum(8, [2, 3, 5]));

//can construct

// function canConstruct(target, wordBank) {
//   const temp = Array(target.length + 1).fill(false);
//   temp[0] = true;
//   for (let i = 0; i < target.length; i++) {
//     if (temp[i] === true) {
//       for (let j = 0; j < wordBank.length; j++) {
//         if (target.slice(i, i + wordBank[j].length) === wordBank[j]) {
//           temp[i + wordBank[j].length] = true;
//         }
//       }
//     }
//   }
//   return temp[target.length];
// }

// const target = "abcdef";
// const wordBank = ["ab", "abc", "cd", "def", "abcd"];
// console.log(canConstruct(target, wordBank));

// function countConstruct(target, wordBank) {
//   const table = Array(target.length + 1).fill(0);
//   table[0] = 1;
//   for (let i = 0; i < target.length; i++) {
//       for (let j = 0; j < wordBank.length; j++) {
//         if (target.slice(i, i + wordBank[j].length) === wordBank[j])
//           table[i + wordBank[j].length] += table[i];
//       }
    
//   }
//   console.log(table);
//   return table[target.length];
// }

// const target = "purple";
// const wordBank = ["purp", "p", "ur", "le", "purpl"];
// console.log(countConstruct(target, wordBank));


function allConstruct(target, wordBank) {
  const table = Array(target.length + 1).fill().map(()=>[]);
  table[0] = [[]];
  for (let i = 0; i < target.length; i++) {
      for (let j = 0; j < wordBank.length; j++) {
        if (target.slice(i, i + wordBank[j].length) === wordBank[j]){
            const newCombination= table[i].map(s=>[...s,wordBank[j]])
            table[i+wordBank[j].length].push(...newCombination);
        }
      }
    
  }
  return table[target.length];
}



const target = "abcdef";
const wordBank = ["ab", "abc", "cd", "def", "abcd","ef","c"];
console.log(allConstruct(target, wordBank));