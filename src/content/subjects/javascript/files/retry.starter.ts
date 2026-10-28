export function retry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  opts: { retries: number; baseDelayMs: number; signal?: AbortSignal },
): Promise<T> {
  // your code
}
