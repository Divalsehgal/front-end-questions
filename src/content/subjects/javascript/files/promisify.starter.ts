type Callback<T> = (err: unknown, result?: T) => void;

export function promisify<T>(fn: (...args: any[]) => void): (...args: any[]) => Promise<T> {
  // your code
}
