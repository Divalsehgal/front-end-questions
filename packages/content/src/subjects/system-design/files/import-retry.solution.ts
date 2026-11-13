const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function importWithRetry<T>(
  load: () => Promise<T>,
  { retries = 2, baseDelayMs = 500, wait = sleep }: { retries?: number; baseDelayMs?: number; wait?: (ms: number) => Promise<void> } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await load();
    } catch (error) {
      // Out of retries: let the caller (an error handler that reloads, or an error boundary) deal with it.
      if (attempt >= retries) throw error;
      await wait(baseDelayMs * 2 ** attempt);
    }
  }
}
