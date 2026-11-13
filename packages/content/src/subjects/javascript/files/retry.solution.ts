// Waits `ms`, but stops early with the abort reason if the signal is aborted.
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export async function retry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  opts: { retries: number; baseDelayMs: number; signal?: AbortSignal },
): Promise<T> {
  const signal = opts.signal ?? new AbortController().signal;
  let attempt = 0;

  while (true) {
    if (signal.aborted) {
      throw signal.reason;
    }
    try {
      return await fn(signal);
    } catch (error) {
      if (attempt === opts.retries) {
        throw error; // no retries left: give up with the last error
      }
      await wait(opts.baseDelayMs * 2 ** attempt, signal); // 1x, 2x, 4x, ...
      attempt++;
    }
  }
}
