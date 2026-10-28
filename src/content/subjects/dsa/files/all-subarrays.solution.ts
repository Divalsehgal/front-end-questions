// Every start, then every end after it: O(n²) subarrays.
export function allSubarrays<T>(arr: T[]): T[][] {
  const subarrays: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j <= arr.length; j++) {
      subarrays.push(arr.slice(i, j));
    }
  }
  return subarrays;
}
