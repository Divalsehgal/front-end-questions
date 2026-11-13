// Links from the HashRouter days (…/#/q/react/x) should load the real, prerendered page instead.
// The hash is attacker-controllable (anyone can share a crafted link), so only a plain relative app
// path is accepted: it must start with a letter or digit and contain only word characters, '-' and
// '/', never '//'. That rules out protocol-relative ('//evil.com'), backslash, scheme ('https:',
// 'javascript:') and percent-encoded tricks. The resolved URL must also stay on this origin.
const SAFE_PATH = /^[a-z0-9][\w\-/]*$/i;

/**
 * The same-origin URL a legacy `#/path` link should be replaced with, or null when the hash is not
 * a legacy route (or is not a safe one), in which case the app just mounts.
 */
export function legacyRedirectTarget(hash: string, origin: string, base: string): string | null {
  if (!hash.startsWith('#/')) return null;
  const path = hash.slice(2);
  if (!SAFE_PATH.test(path) || path.includes('//')) return null;
  const url = new URL(path, origin + base);
  return url.origin === origin ? url.href : null;
}
