export function isArray(value: unknown): value is unknown[] {
  // your code
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  // your code
}

/** Objects AND functions count; null does not. */
export function isObject(value: unknown): value is object {
  // your code
}

/** Only {} literals, Object.create(null), and new Object(). Not arrays, dates, class instances. */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  // your code
}
