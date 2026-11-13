function swap(arr: number[], i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Each pass pushes the biggest remaining number to the end.
export function bubbleSort(input: number[]): number[] {
  const arr = [...input];
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break; // no swaps: already sorted
  }
  return arr;
}

// Find the smallest remaining number and put it at position i.
export function selectionSort(input: number[]): number[] {
  const arr = [...input];
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    swap(arr, i, minIndex);
  }
  return arr;
}

// Take each number and shift the bigger ones before it to the right until it fits.
export function insertionSort(input: number[]): number[] {
  const arr = [...input];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
