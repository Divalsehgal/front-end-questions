function reverse(nums: number[], l: number, r: number) {
  while (l < r) {
    const temp = nums[l];
    nums[l] = nums[r];
    nums[r] = temp;
    l++;
    r--;
  }
}

// Rotating right by k = reverse everything, then reverse the first k, then reverse the rest.
// [1,2,3,4,5], k=2 → [5,4,3,2,1] → [4,5,3,2,1] → [4,5,1,2,3]
export function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}
