// k is where the next number we keep goes.
export function removeElement(nums: number[], val: number): number {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}

export function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let k = 1; // the first number is always kept
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}

export function moveZeroes(nums: number[]): void {
  let k = 0; // where the next non-zero number goes
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      const temp = nums[k];
      nums[k] = nums[i];
      nums[i] = temp;
      k++;
    }
  }
}

function isLetterOrDigit(char: string): boolean {
  return /[a-z0-9]/i.test(char);
}

export function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (!isLetterOrDigit(s[left])) {
      left++;
    } else if (!isLetterOrDigit(s[right])) {
      right--;
    } else {
      if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
      left++;
      right--;
    }
  }
  return true;
}

// Start with the widest container. Moving the shorter wall in is the only way the area can grow.
export function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}
