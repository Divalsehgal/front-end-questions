export function canSum(target: number, numbers: number[], memo: Record<number, boolean> = {}): boolean {
  if (target in memo) return memo[target];
  if (target === 0) return true;
  if (target < 0) return false;
  for (const num of numbers) {
    if (canSum(target - num, numbers, memo)) {
      memo[target] = true;
      return true;
    }
  }
  memo[target] = false;
  return false;
}

export function howSum(target: number, numbers: number[], memo: Record<number, number[] | null> = {}): number[] | null {
  if (target in memo) return memo[target];
  if (target === 0) return [];
  if (target < 0) return null;
  for (const num of numbers) {
    const result = howSum(target - num, numbers, memo);
    if (result !== null) {
      memo[target] = [...result, num];
      return memo[target];
    }
  }
  memo[target] = null;
  return null;
}

export function bestSum(target: number, numbers: number[], memo: Record<number, number[] | null> = {}): number[] | null {
  if (target in memo) return memo[target];
  if (target === 0) return [];
  if (target < 0) return null;
  let shortest: number[] | null = null;
  for (const num of numbers) {
    const result = bestSum(target - num, numbers, memo);
    if (result !== null) {
      const combination = [...result, num];
      if (shortest === null || combination.length < shortest.length) {
        shortest = combination;
      }
    }
  }
  memo[target] = shortest;
  return shortest;
}
