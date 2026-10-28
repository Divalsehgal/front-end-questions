/** New object with only the listed keys that exist on obj. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // your code
}
/** New object without the listed keys. */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  // your code
}
/** "my name is dival" → "My Name Is Dival". Only the first letter of each space-separated word changes ("don't" stays "Don't"). */
export function capitalize(str: string): string {
  // your code
}
/** Reverse a string, or the digits of a number (keeping the sign): reverse(-120) → -21. */
export function reverse<T extends string | number>(value: T): T {
  // your code
}
/** Like String.prototype.split(separator) for a non-empty separator string, without using split. */
export function mySplit(str: string, separator: string): string[] {
  // your code
}
