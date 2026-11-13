/** Decorator: wrap fn so every call logs `${name}(${args joined by ', '}) → ${result}` via the given log function. Keep `this`. */
export function withLogging<A extends unknown[], R>(fn: (...args: A) => R, name: string, log: (line: string) => void): (...args: A) => R {
  // your code
}

/** Decorator: retry a failing async function up to `times` extra attempts before giving up with the last error. */
export function withRetry<A extends unknown[], R>(fn: (...args: A) => Promise<R>, times: number): (...args: A) => Promise<R> {
  // your code
}

/** Adapter: the old API returns { city, habitants } with raw counts; the app expects millions, truncated (not rounded) to 1 decimal. */
export function toMillionsAdapter(city: { city: string; habitants: number }): { city: string; habitants: number } {
  // your code
}

/** Facade: one call that runs the steps in order and returns their results; stops at the first step that throws. */
export function startCar(steps: { checkFuel(): string; checkBattery(): string; startEngine(): string }): string[] {
  // your code
}
