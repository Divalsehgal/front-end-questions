function swap(p1, p2, arr) {
  let temp = arr[p1];
  arr[p1] = arr[p2];
  arr[p2] = temp;
}

function selectionSort(arr) {
  let min;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      min = arr[j];
      if (arr[i] > min) {
        min = arr[j];
        swap(i,j,arr);
      }
    }
  }
  return arr
}


const arr = [64, 25, 12, 22, 11,0,-8,22];
console.log(selectionSort(arr));


// SIMPLE & EASY