/** { a: { b: 1 } } → { 'a.b': 1 }. Arrays use their index: { a: [x] } → { 'a.0': x }. */
export function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  // your code
}
