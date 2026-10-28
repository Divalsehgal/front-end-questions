export type Row = Record<string, unknown>;

const NUMERIC = /^\s*-?\d+(\.\d+)?\s*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;

// Turn a value into something comparable, tagged with the kind of comparison it needs.
function normalize(v: unknown): { kind: 'number' | 'string'; value: number | string } {
  if (typeof v === 'number') return { kind: 'number', value: v };
  if (v instanceof Date) return { kind: 'number', value: v.getTime() };
  const s = String(v);
  if (NUMERIC.test(s)) return { kind: 'number', value: Number(s) };
  if (ISO_DATE.test(s)) return { kind: 'number', value: Date.parse(s) }; // honours Z / +05:00 offsets
  return { kind: 'string', value: s };
}

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

function compareValues(a: unknown, b: unknown): number {
  const x = normalize(a);
  const y = normalize(b);
  if (x.kind === 'number' && y.kind === 'number') return (x.value as number) - (y.value as number);
  return collator.compare(String(x.value), String(y.value));
}

export function sortRows<T extends Row>(rows: readonly T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] {
  const sign = dir === 'asc' ? 1 : -1;
  const isEmpty = (v: unknown) => v === null || v === undefined;
  // Copy first: Array.prototype.sort mutates. Since ES2019 sort is stable, so ties keep
  // their input order; flipping the SIGN (not reversing the array) keeps that true for desc.
  return [...rows].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (isEmpty(va) || isEmpty(vb)) return Number(isEmpty(va)) - Number(isEmpty(vb)); // empties last, either direction
    return sign * compareValues(va, vb);
  });
}
