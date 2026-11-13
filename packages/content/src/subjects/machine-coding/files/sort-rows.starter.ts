// The take-home's comparator, lifted out of the table. It "works" on the demo data
// but fails most of the tests. Fix it.
export type Row = Record<string, unknown>;

export function sortRows<T extends Row>(rows: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] {
  return rows.sort((a, b) => {
    const valueA = a[key] as never;
    const valueB = b[key] as never;
    if (valueA < valueB) return dir === 'asc' ? -1 : 1;
    if (valueA > valueB) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}
