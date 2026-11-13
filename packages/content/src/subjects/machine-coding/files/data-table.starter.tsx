import { useState } from 'react';

// ---------------------------------------------------------------------------
// Fake API: use this instead of the network. It filters, sorts and pages "on the
// server", so a sort covers the WHOLE dataset, not just the rows you've loaded.
// Only `compare` is left for you.
// ---------------------------------------------------------------------------
type Usage = { id: string; service: string; location: string; date: string; quantity: number; cost: number };
type SortKey = Exclude<keyof Usage, 'id'>;
type SortDir = 'asc' | 'desc';
type Column = { key: SortKey; label: string; type: 'string' | 'number' | 'date' };
type Query = { service: string; sortKey: SortKey; dir: SortDir };
type Page = { rows: Usage[]; total: number };

const COLUMNS: Column[] = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'service', label: 'Service', type: 'string' },
  { key: 'location', label: 'Location', type: 'string' },
  { key: 'quantity', label: 'Quantity', type: 'number' },
  { key: 'cost', label: 'Cost', type: 'number' },
];
const SERVICES = ['Compute', 'Storage', 'Networking', 'Database', 'Analytics']; // Analytics has no rows
const LOCATIONS = ['East US', 'West Europe', 'Southeast Asia', 'Brazil South', 'Åland'];
const PAGE_SIZE = 25;

// Deterministic PRNG, so the data is identical on every run.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DB: Usage[] = (() => {
  const rand = mulberry32(42);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  return Array.from({ length: 237 }, (_, i) => ({
    id: `u-${i + 1}`,
    service: pick(SERVICES.slice(0, 4)),
    location: pick(LOCATIONS),
    date: new Date(Date.UTC(2024, 0, 1 + Math.floor(rand() * 365))).toISOString().slice(0, 10),
    quantity: Math.round(rand() * 2000) / 10,
    cost: Math.round(rand() * 90000) / 100,
  }));
})();

// TODO: compare two rows by `col` so that numbers compare numerically, dates
// chronologically and strings with the user's locale (case-insensitive, 'Åland' near 'A').
function compare(a: Usage, b: Usage, col: Column): number {
  return 0;
}

function fetchUsage(query: Query, offset: number, opts: { signal: AbortSignal; fail?: boolean }): Promise<Page> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (opts.fail) return reject(new Error('503: usage service unavailable'));
      const col = COLUMNS.find((c) => c.key === query.sortKey)!;
      const sign = query.dir === 'asc' ? 1 : -1;
      const rows = DB.filter((r) => query.service === 'all' || r.service === query.service)
        // Tie-break on id: offset paging needs a TOTAL order, or rows repeat/skip between pages.
        .sort((a, b) => sign * compare(a, b, col) || a.id.localeCompare(b.id));
      resolve({ rows: rows.slice(offset, offset + PAGE_SIZE).map((r) => ({ ...r })), total: rows.length });
    }, 300 + Math.random() * 500);
    opts.signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

// ---------------------------------------------------------------------------
// Your table. fetchUsage(query, offset, { signal, fail }) resolves to
// { rows, total } after 300-800ms, and rejects with an AbortError when aborted.
// ---------------------------------------------------------------------------
export default function DataTable() {
  // your code
  return <div className="p-6">Start building here</div>;
}
