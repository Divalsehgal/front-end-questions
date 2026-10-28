// Keep a running sum of the left side. The right side is total - left - nums[i].
export function pivotIndex(nums: number[]): number {
  let total = 0;
  for (const num of nums) total += num;

  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    const right = total - left - nums[i];
    if (left === right) return i;
    left += nums[i];
  }
  return -1;
}
