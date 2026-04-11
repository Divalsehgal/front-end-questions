function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(j, j + 1, arr);
      }
    }
  }
  return arr;
}

function swap(p1, p2, arr) {
  let temp = arr[p1];
  arr[p1] = arr[p2];
  arr[p2] = temp;
}

const arr = [64, 25, 12, 22, 11, 0, -8, 22];
console.log(bubbleSort(arr));
