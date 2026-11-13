'use client';
// The client shell around every page: sidebar layout plus client startup work.
import { useEffect } from 'react';
import { legacyRedirectTarget } from '../legacyRedirect';
import { hydrateStorage } from '../state/sync';
import { applyTheme } from '../state/theme';
import { Layout } from '../ui/Layout';
import type { ReactNode } from 'react';

const BASE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`;

export function Shell({ children }: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    // Links from the HashRouter days (…/#/q/react/x) load the real page instead
    // (same-origin, safe app paths only: see legacyRedirect.ts).
    const legacy = legacyRedirectTarget(location.hash, location.origin, BASE);
    if (legacy) return location.replace(legacy);
    applyTheme();
    // Merge the durable IndexedDB copy (and a synced file) into the localStorage mirror loaded at import.
    hydrateStorage().catch((err: unknown) => console.error(err));
  }, []);
  return <Layout>{children}</Layout>;
}
