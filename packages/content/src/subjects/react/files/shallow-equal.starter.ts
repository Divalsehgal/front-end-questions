/**
 * The comparison React.memo uses (and react-redux's shallowEqual for useSelector):
 * same keys, and each value equal by Object.is (NOT deep).
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
  // your code
}
