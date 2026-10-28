export type KeyValueStore = { getItem(key: string): string | null; setItem(key: string, value: string): void };
export type PreloadErrorEvent = { preventDefault(): void };

const KEY = 'chunk-reload-at';

export function createChunkErrorHandler({
  storage,
  reload,
  now = Date.now,
  windowMs = 10_000,
}: {
  storage: KeyValueStore;
  reload: () => void;
  now?: () => number;
  windowMs?: number;
}): (event: PreloadErrorEvent) => void {
  return (event) => {
    const t = now();
    try {
      // sessionStorage survives the reload, so the next page load can see we just tried.
      const last = Number(storage.getItem(KEY));
      if (last && t - last < windowMs) return;
      storage.setItem(KEY, String(t));
    } catch {
      // Without a place to remember the attempt there is no loop guard: don't risk reloading forever.
      return;
    }
    event.preventDefault();
    reload();
  };
}
