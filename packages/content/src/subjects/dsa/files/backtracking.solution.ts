// Start with [[]]. For each item, copy every subset we have so far and add the item to the copy.
export function subsets<T>(items: T[]): T[][] {
  const result: T[][] = [[]];
  for (const item of items) {
    const withItem: T[][] = [];
    for (const subset of result) {
      withItem.push([...subset, item]);
    }
    result.push(...withItem);
  }
  return result;
}

// Backtracking: pick an unused item, go deeper, then undo the pick and try the next one.
export function permutations<T>(items: T[]): T[][] {
  const result: T[][] = [];
  const path: T[] = [];
  const used: boolean[] = [];

  function build() {
    if (path.length === items.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(items[i]);
      build();
      path.pop();
      used[i] = false;
    }
  }

  build();
  return result;
}
