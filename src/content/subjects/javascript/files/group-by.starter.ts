/** Group items by the key returned from `iteratee`, or by a property name. Order within a group is preserved. */
export function groupBy<T>(arr: readonly T[], iteratee: ((item: T) => PropertyKey) | keyof T): Record<PropertyKey, T[]> {
  // your code
}

/** Count items per key. */
export function countBy<T>(arr: readonly T[], iteratee: ((item: T) => PropertyKey) | keyof T): Record<PropertyKey, number> {
  // your code
}
