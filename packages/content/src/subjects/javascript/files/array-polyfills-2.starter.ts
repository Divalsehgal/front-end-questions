// Implement as standalone functions (don't call the native method of the same name).
/** Like Array.prototype.at: negative indexes count from the end; out of range → undefined. */
export function at<T>(arr: T[], index: number): T | undefined {
  // your code
}
export function find<T>(arr: T[], pred: (v: T, i: number) => boolean): T | undefined {
  // your code
}
export function findIndex<T>(arr: T[], pred: (v: T, i: number) => boolean): number {
  // your code
}
/** true for an empty array. Stops at the first failure. */
export function every<T>(arr: T[], pred: (v: T, i: number) => boolean): boolean {
  // your code
}
/** false for an empty array. Stops at the first success. */
export function some<T>(arr: T[], pred: (v: T, i: number) => boolean): boolean {
  // your code
}
/** Like Array.prototype.fill(value, start = 0, end = length), negatives allowed; mutates and returns arr. */
export function fill<T>(arr: T[], value: T, start = 0, end = arr.length): T[] {
  // your code
}
