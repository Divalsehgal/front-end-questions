export function pyramid(n: number): string {
  let result = '';
  for (let i = 1; i <= n; i++) {
    let row = '';
    for (let k = 1; k <= n - i; k++) {
      row += ' ';
    }
    for (let j = 1; j <= 2 * i - 1; j++) {
      row += '#';
    }
    result += row + '\n';
  }
  return result;
}

export function updateInventory(curInv: [number, string][], newInv: [number, string][]): [number, string][] {
  // Add up the quantity for each item name.
  const totals: Record<string, number> = {};
  for (const [qty, name] of [...curInv, ...newInv]) {
    if (totals[name] === undefined) {
      totals[name] = 0;
    }
    totals[name] += qty;
  }

  const result: [number, string][] = [];
  for (const name in totals) {
    result.push([totals[name], name]);
  }
  result.sort((a, b) => (a[1] > b[1] ? 1 : -1)); // by name
  return result;
}
