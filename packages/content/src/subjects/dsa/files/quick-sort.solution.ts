function swap(arr: number[], x: number, y: number) {
  const temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
}

// Put everything smaller than the pivot on its left, and return where the pivot ends up.
function pivot(arr: number[], left: number, right: number): number {
  // Use the middle element as the pivot. Always using the first one is very slow
  // (and overflows the stack) when the array is already sorted.
  swap(arr, left, Math.floor((left + right) / 2));
  let shift = left;
  for (let i = left + 1; i <= right; i++) {
    if (arr[i] < arr[left]) {
      shift++;
      swap(arr, i, shift);
    }
  }
  swap(arr, left, shift);
  return shift;
}

export function quickSort(arr: number[], left = 0, right = arr.length - 1): number[] {
  if (left < right) {
    const pivotIndex = pivot(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}
