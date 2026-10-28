// Sort, fix the first number, then move two pointers from both ends for the other two.
// To avoid duplicate triplets, skip a number that is the same as the one before it.
export function threeSum(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];

  for (let start = 0; start < sorted.length - 2; start++) {
    if (start > 0 && sorted[start] === sorted[start - 1]) continue; // same first number again

    let left = start + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[start] + sorted[left] + sorted[right];
      if (sum === 0) {
        result.push([sorted[start], sorted[left], sorted[right]]);
        left++;
        right--;
        while (left < right && sorted[left] === sorted[left - 1]) left++; // same second number again
      } else if (sum > 0) {
        right--; // too big: use a smaller number
      } else {
        left++; // too small: use a bigger number
      }
    }
  }
  return result;
}
