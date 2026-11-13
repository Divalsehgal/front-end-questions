export function mergeSorted(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;
  // Use indexes, not shift(): shift moves every element and makes this slow.
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    result.push(a[i]);
    i++;
  }
  while (j < b.length) {
    result.push(b[j]);
    j++;
  }
  return result;
}

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return mergeSorted(left, right);
}
