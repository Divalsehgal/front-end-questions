// Try every start. From each start, keep adding numbers and check the sum. O(n²).
// A sliding window doesn't work here, because negative numbers can make the sum go down.
export function subarrayWithSum(nums: number[], target: number): number[] | null {
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum === target) {
        return nums.slice(start, end + 1);
      }
    }
  }
  return null;
}
