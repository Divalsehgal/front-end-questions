function merge(left, right) {
  let sortedArr = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sortedArr.push(left.shift());
    } else {
      sortedArr.push(right.shift());
    }
  }
  return [...sortedArr, ...left, ...right];
}

function mergeSort(arr) {
  // Base 
  
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);


  // Recursive calls
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);

}


const arr = [64, 25, 12, 22, 11, 0, -8, 22];
console.log(mergeSort(arr));