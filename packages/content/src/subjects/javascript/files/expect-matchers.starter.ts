/**
 * A tiny assertion helper, like Jest's:
 *   expect(5).toBe(5)        → true   (compares with Object.is, like Jest: NaN equals NaN, 0 ≠ -0)
 *   expect(5).toBe(null)     → throws Error('Not Equal')
 *   expect(5).notToBe(null)  → true
 *   expect(5).notToBe(5)     → throws Error('Equal')
 *   expect([1]).toEqual([1]) → true (deep equality, throws Error('Not Deep Equal'))
 */
export function expect(actual: unknown): { toBe(v: unknown): true; notToBe(v: unknown): true; toEqual(v: unknown): true } {
  // your code
}
