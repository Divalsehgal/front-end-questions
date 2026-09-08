const quickSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  let pivot = arr[0];
  let leftArr = [];
  let rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};


//functional/extra-space variant (builds new left/right arrays each call)
//O(n log(n)) time, O(n) extra space - NOT in-place
//unstable i.e. (order is not same)
const arr = [64, 25, 12, 22, 11, 0, -8, 22];
