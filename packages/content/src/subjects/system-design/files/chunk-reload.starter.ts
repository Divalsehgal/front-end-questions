export type KeyValueStore = { getItem(key: string): string | null; setItem(key: string, value: string): void };
export type PreloadErrorEvent = { preventDefault(): void };

/**
 * Build a handler for Vite's `vite:preloadError` event (a lazy chunk failed to load, usually
 * because a deploy removed it). The handler should reload the page to pick up the new HTML,
 * but never more than once per `windowMs`, or a chunk that is still broken would reload forever.
 *
 * - Reloading: call event.preventDefault() (so the error isn't thrown), remember when, then reload().
 * - Not reloading (reloaded too recently, or storage is unusable): leave the event alone, so the
 *   error reaches the app's error boundary instead.
 */
export function createChunkErrorHandler(options: {
  storage: KeyValueStore;
  reload: () => void;
  now?: () => number;
  windowMs?: number;
}): (event: PreloadErrorEvent) => void {
  // your code
}
