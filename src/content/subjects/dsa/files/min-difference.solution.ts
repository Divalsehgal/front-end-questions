// After sorting, the best group of k is always k numbers next to each other.
export function minimumDifference(nums: number[], k: number): number {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = Infinity;
  for (let l = 0; l + k - 1 < sorted.length; l++) {
    const r = l + k - 1;
    best = Math.min(best, sorted[r] - sorted[l]);
  }
  return best;
}
