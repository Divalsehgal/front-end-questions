/** pipe(f, g, h)(x) === h(g(f(x))). The first function may take several arguments. */
export function pipe(...fns: ((...args: any[]) => any)[]): (...args: any[]) => any {
  // your code
}

/** compose(f, g, h)(x) === f(g(h(x))): right to left. */
export function compose(...fns: ((...args: any[]) => any)[]): (...args: any[]) => any {
  // your code
}
