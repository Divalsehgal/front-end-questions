/**
 * Pick the Cache-Control header a static host should send for a request path:
 * - a content-hashed build asset (/assets/<name>-<8-char hash>.<ext>) → cache for a year, never revalidate
 * - an API response (/api/...) → never store
 * - everything else (HTML pages, /, unhashed files like /favicon.svg) → store, but revalidate every time
 */
export function cacheControlFor(path: string): string {
  // your code
}
