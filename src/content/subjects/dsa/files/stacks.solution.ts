export function isValidParentheses(s: string): boolean {
  const closeToOpen: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];
  for (const char of s) {
    if (char in closeToOpen) {
      // A closing bracket must match the last opening one.
      if (stack.length > 0 && stack[stack.length - 1] === closeToOpen[char]) {
        stack.pop();
      } else {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}

// The stack holds numbers still waiting for a bigger one.
// When a bigger number comes, it is the answer for every smaller number it pops.
export function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const stack: number[] = [];
  const next = new Map<number, number>();
  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      next.set(stack.pop()!, num);
    }
    stack.push(num);
  }
  while (stack.length > 0) {
    next.set(stack.pop()!, -1); // nothing bigger came after these
  }
  return nums1.map((num) => next.get(num)!);
}

// Same idea, but the stack holds day indexes, and the answer is how many days we waited.
export function dailyTemperatures(temps: number[]): number[] {
  const result: number[] = new Array(temps.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
      const day = stack.pop()!;
      result[day] = i - day;
    }
    stack.push(i);
  }
  return result;
}
