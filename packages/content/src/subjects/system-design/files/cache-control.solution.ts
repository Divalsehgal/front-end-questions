// Vite's default output names look like /assets/index-BFP5p68h.js: name, dash, 8-char hash.
const HASHED = /^\/assets\/.+-[\w-]{8}\.[a-z0-9]+$/i;

export function cacheControlFor(path: string): string {
  // The name changes whenever the content does, so this URL can never serve different bytes.
  if (HASHED.test(path)) return 'public, max-age=31536000, immutable';
  // Per-user, changing data: don't keep a copy anywhere.
  if (path === '/api' || path.startsWith('/api/')) return 'no-store';
  // Same URL across deploys (HTML points at the current hashed files): keep it, but check first.
  return 'no-cache';
}
