// Memoization: remember each answer so we never work out the same n twice.
export function fibMemo(n: number, memo: Record<number, number> = {}): number {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Tabulation: build up from the start with a loop.
export function fibTab(n: number): number {
  if (n <= 0) return 0;
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

export function gridTraveler(m: number, n: number, memo: Record<string, number> = {}): number {
  const key = `${m},${n}`;
  if (key in memo) return memo[key];
  if (m === 0 || n === 0) return 0;
  if (m === 1 && n === 1) return 1;
  memo[key] = gridTraveler(m - 1, n, memo) + gridTraveler(m, n - 1, memo); // move down + move right
  return memo[key];
}
