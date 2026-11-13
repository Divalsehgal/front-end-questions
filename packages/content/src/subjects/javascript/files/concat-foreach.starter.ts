/** Like Array.prototype.concat: returns a NEW array; array arguments are flattened one level, other values appended. */
export function concat<T>(base: T[], ...items: (T | T[])[]): T[] {
  // your code
}

/** Like Array.prototype.forEach: calls cb(value, index, array) with thisArg, skips holes, always returns undefined. */
export function forEach<T>(arr: T[], cb: (value: T, index: number, array: T[]) => void, thisArg?: unknown): void {
  // your code
}
