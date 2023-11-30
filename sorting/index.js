function swap(p1, p2, arr) {
  let temp = arr[p1];
  arr[p1] = arr[p2];
  arr[p2] = temp;
}

//------------------------------------------------------------    SELECTION SORT ----------------------------------------------------------------

// function selectionSort(arr) {
//   let min;
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i; j < arr.length; j++) {
//       min = arr[j];
//       if (arr[i] > min) {
//         min = arr[j];
//         swap(i,j,arr);
//       }
//     }
//   }
//   return arr
// }

// const arr = [64, 25, 12, 22, 11,0,-8,22];
// console.log(selectionSort(arr));
/*
first iteration 

64 25 min is 25
64 12 min become 12
64 22 min still 12
64 11 min become 11
64 0 min become 0
64 -8 min become -8
64 22 min still -8

[-8 25 12 22 11 0 64 22]

inplace no extra space



//  complexity n^2



*/

//------------------------------------------------------------    BUBBLE SORT ----------------------------------------------------------------



// function bubbleSort(arr) {

//   let n=arr.length;

//   for (let i = 0; i < n ; i++) {
//     for (let j = 0; j < n - i ; j++) {
//       if (arr[j] > arr[j + 1]) {
//         swap(j, j + 1, arr);
//       }
//     }
//   }
//   return arr
// }

//  complexity n^2

//------------------------------------------------------------    INSERTION SORT ----------------------------------------------------------------

// function insertionSort(arr) {
//   let n = arr.length,
//     key,
//     j;

//   for (let i = 1; i < n; i++) {
//     key = arr[i];
//     j = i - 1;
//     while (arr[j] > key) {
//       arr[j + 1] = arr[j];
//       j = j - 1;
//     }
//     arr[j + 1] = key;
//   }
//   return arr;
// }

/*
2,64, 25, 12, 22, 11,0,-8,22
2,25, 64, 12, 22, 11,0,-8,22
2,25, 12, 64, 22, 11,0,-8,22
2,12, 25, 64, 22, 11,0,-8,22
contd.
*/


//Best  O(n) 
//worst  complexity is N^2

//------------------------------------------------------------    MERGE SORT ----------------------------------------------------------------
// function merge(left, right) {
//   let sortedArr = []; 
//   while (left.length && right.length) {
//     if (left[0] < right[0]) {
//       sortedArr.push(left.shift());
//     } else {
//       sortedArr.push(right.shift());
//     }
//   }
//   return [...sortedArr, ...left, ...right];
// }

// function mergeSort(arr) {
//   // Base case
//   if (arr.length <= 1) return arr;
//   let mid = Math.floor(arr.length / 2);
//   // Recursive calls
//   let left = mergeSort(arr.slice(0, mid));
//   let right = mergeSort(arr.slice(mid));
//   return merge(left, right);

// }


//  complexity nlogn

//------------------------------------------------------------    QUICK SORT ----------------------------------------------------------------



// const quickSort = (arr) => {
//   if (arr.length <= 1) {
//     return arr;
//   }

//   let pivot = arr[0];
//   let leftArr = [];
//   let rightArr = [];

//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] < pivot) {
//       leftArr.push(arr[i]);
//     } else {
//       rightArr.push(arr[i]);
//     }
//   }

//   return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
// };




//complexity nlogn



//------------------------------------------------------------    HEAP SORT ----------------------------------------------------------------

//------------------------------------------------------------    COUNT SORT ----------------------------------------------------------------

//------------------------------------------------------------    RADIX SORT ----------------------------------------------------------------


//------------------------------------------------------------    BUCKET SORT ----------------------------------------------------------------

const arr = [2, 64, 25, 12, 22, 11, 0, -8, 22];
console.log(quickSort(arr));



// Referances : https://www.geeksforgeeks.org/sorting-algorithms/