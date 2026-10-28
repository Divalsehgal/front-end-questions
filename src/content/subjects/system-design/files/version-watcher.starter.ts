/**
 * Detect that a newer deploy is live while this tab still runs the old bundle, and decide how
 * the next in-app navigation should happen.
 *
 * - check(): fetches the live version. The tab is stale when the latest successfully fetched
 *   version differs from `current`. A failed fetch (offline, 500) or an empty version changes
 *   nothing and must not throw. Resolves to whether the tab is stale.
 * - isStale(): the result of the last successful check (false before any).
 * - navigationMode(currentPath): 'full' (a real page load that fetches the new HTML) when stale,
 *   'spa' otherwise — but always 'spa' while the user is inside a `holdOn` flow such as
 *   '/checkout' (that path or anything under it), so nobody is moved mid-checkout.
 */
export function createVersionWatcher(options: {
  current: string;
  fetchVersion: () => Promise<string>;
  holdOn?: string[];
}): { check(): Promise<boolean>; isStale(): boolean; navigationMode(currentPath: string): 'full' | 'spa' } {
  // your code
}
