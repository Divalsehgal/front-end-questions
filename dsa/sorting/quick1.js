function swap(arr, x, y) {
  [arr[x], arr[y]] = [arr[y], arr[x]];
}

function pivot(arr, left = 0, right = arr.length - 1) {
  let shift = left;
  for (let i = left + 1; i <= right; i++) {
    if (arr[i] < arr[left]) {
      swap(arr, i, ++shift);
    }
  }

  swap(arr, left, shift);
  return shift;
}

function quickSort(array, left = 0, right = array.length - 1) {
  if (left < right) {
    let pivotI = pivot(array, left, right);

    quickSort(array, left, pivotI - 1);
    quickSort(array, pivotI + 1, right);
  }
  return array;
}



const arr = [64, 25, 12, 22, 11, 0, -8, 22];
console.log(quickSort(arr));
