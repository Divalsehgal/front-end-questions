export function binarySearch(arr: number[], target: number): number {
  let i = 0;
  let j = arr.length - 1;
  while (i <= j) {
    const mid = Math.floor((i + j) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      i = mid + 1;
    } else {
      j = mid - 1;
    }
  }
  return -1;
}

export function binarySearchRecursive(arr: number[], target: number, i = 0, j = arr.length - 1): number {
  if (i > j) {
    return -1;
  }
  const mid = Math.floor((i + j) / 2);
  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] > target) {
    return binarySearchRecursive(arr, target, i, mid - 1);
  } else {
    return binarySearchRecursive(arr, target, mid + 1, j);
  }
}

// The first index whose value is >= target (where target would be inserted).
export function lowerBound(arr: number[], target: number): number {
  let i = 0;
  let j = arr.length; // j can be arr.length: "after everything"
  while (i < j) {
    const mid = Math.floor((i + j) / 2);
    if (arr[mid] < target) {
      i = mid + 1;
    } else {
      j = mid;
    }
  }
  return i;
}
