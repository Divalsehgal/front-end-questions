export function createVersionWatcher({
  current,
  fetchVersion,
  holdOn = [],
}: {
  current: string;
  fetchVersion: () => Promise<string>;
  holdOn?: string[];
}): { check(): Promise<boolean>; isStale(): boolean; navigationMode(currentPath: string): 'full' | 'spa' } {
  let stale = false;

  const inside = (path: string, prefix: string) => path === prefix || path.startsWith(prefix.replace(/\/$/, '') + '/');

  return {
    async check() {
      try {
        const live = await fetchVersion();
        // Only a real answer counts: being offline says nothing about what is deployed.
        if (typeof live === 'string' && live) stale = live !== current;
      } catch {
        // Keep the last known state.
      }
      return stale;
    },
    isStale: () => stale,
    navigationMode(currentPath) {
      if (!stale || holdOn.some((p) => inside(currentPath, p))) return 'spa';
      // A full page load revalidates the HTML, which points at the new hashed chunks.
      return 'full';
    },
  };
}
