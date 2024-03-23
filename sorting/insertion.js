function insertionSort(arr) {
  let n = arr.length,
    key,
    j;

  for (let i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;
    // decrement the j variable untill first value is greater than current
    while (arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}



const arr = [64, 25, 12, 22, 11, 0, -8, 22];
console.log(insertionSort(arr));
