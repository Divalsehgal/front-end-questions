// Make these both CORRECT at runtime and PRECISELY typed (no `any` in the signatures).

/** getProperty(user, 'name') returns string; a key that isn't on the object must not compile. */
export function getProperty(obj: any, key: any): any {
  // your code
}

/** update(user, { age: 29 }) returns a new object; only known keys with the right types are allowed. */
export function update(original: any, changes: any): any {
  // your code
}

/** pair('hello', 42) is typed [string, number]. */
export function pair(a: any, b: any): any {
  // your code
}
