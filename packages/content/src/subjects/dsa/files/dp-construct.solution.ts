export function canConstruct(target: string, wordBank: string[], memo: Record<string, boolean> = {}): boolean {
  if (target in memo) return memo[target];
  if (target === '') return true;
  for (const word of wordBank) {
    if (target.startsWith(word)) {
      const remaining = target.slice(word.length);
      if (canConstruct(remaining, wordBank, memo)) {
        memo[target] = true;
        return true;
      }
    }
  }
  memo[target] = false;
  return false;
}

export function countConstruct(target: string, wordBank: string[], memo: Record<string, number> = {}): number {
  if (target in memo) return memo[target];
  if (target === '') return 1;
  let count = 0;
  for (const word of wordBank) {
    if (target.startsWith(word)) {
      count += countConstruct(target.slice(word.length), wordBank, memo);
    }
  }
  memo[target] = count;
  return count;
}

export function allConstruct(target: string, wordBank: string[], memo: Record<string, string[][]> = {}): string[][] {
  if (target in memo) return memo[target];
  if (target === '') return [[]];
  const result: string[][] = [];
  for (const word of wordBank) {
    if (target.startsWith(word)) {
      const ways = allConstruct(target.slice(word.length), wordBank, memo);
      for (const way of ways) {
        result.push([word, ...way]); // the word comes first, then the rest
      }
    }
  }
  memo[target] = result;
  return result;
}
