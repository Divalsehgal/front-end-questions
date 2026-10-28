/**
 * Call `load` (e.g. () => import('./pages/Checkout')) and retry when it rejects, for flaky networks.
 * Wait `baseDelayMs * 2 ** n` before retry n (500, 1000, 2000…), make at most `retries` retries,
 * and if every attempt fails, reject with the LAST error. Resolve with whatever `load` resolves to.
 * `wait` is injectable so tests don't need real timers.
 *
 * Usage: const Checkout = React.lazy(() => importWithRetry(() => import('./pages/Checkout')));
 */
export async function importWithRetry<T>(
  load: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number; wait?: (ms: number) => Promise<void> } = {},
): Promise<T> {
  // your code
}
