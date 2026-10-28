import { useEffect, useReducer, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Fake API (same as the starter). Sorting, filtering and paging happen "on the
// server", so sorting always covers the WHOLE dataset, not just the loaded rows.
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

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

function compare(a: Usage, b: Usage, col: Column) {
  const x = a[col.key];
  const y = b[col.key];
  if (col.type === 'number') return (x as number) - (y as number);
  if (col.type === 'date') return Date.parse(x as string) - Date.parse(y as string);
  return collator.compare(x as string, y as string);
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
// State: one reducer, so "load more" can be dispatched as often as the observer
// likes. The reducer ignores it unless we're idle and more rows exist.
// ---------------------------------------------------------------------------
type State = { query: Query; page: number; attempt: number; rows: Usage[]; total: number | null; status: 'loading' | 'idle' | 'error'; error: string };
type Action =
  | { type: 'query'; query: Query }
  | { type: 'loadMore' }
  | { type: 'retry' }
  | { type: 'success'; page: Page }
  | { type: 'failure'; error: string };

const initial: State = { query: { service: 'all', sortKey: 'date', dir: 'desc' }, page: 0, attempt: 0, rows: [], total: null, status: 'loading', error: '' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'query': // new filter or sort: start over from page 0
      return { ...state, query: action.query, page: 0, rows: [], total: null, status: 'loading', error: '' };
    case 'loadMore': {
      const hasMore = state.total === null || state.rows.length < state.total;
      return state.status === 'idle' && hasMore ? { ...state, page: state.page + 1, status: 'loading' } : state;
    }
    case 'retry':
      return { ...state, attempt: state.attempt + 1, status: 'loading', error: '' };
    case 'success':
      return { ...state, rows: [...state.rows, ...action.page.rows], total: action.page.total, status: 'idle' };
    case 'failure':
      return { ...state, status: 'error', error: action.error };
  }
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const day = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' });

function format(row: Usage, col: Column) {
  if (col.key === 'cost') return money.format(row.cost);
  if (col.type === 'date') return day.format(new Date(row.date));
  return String(row[col.key]);
}

export default function DataTable() {
  const [state, dispatch] = useReducer(reducer, initial);
  const { query, page, attempt, rows, total, status, error } = state;
  const [simulateErrors, setSimulateErrors] = useState(false);
  const failRef = useRef(false); // read by the fetch effect without making it a dependency
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  // Fetch whenever the query, page or retry counter changes. The cleanup aborts the
  // request, so a slow response for an old filter can never overwrite a newer one.
  useEffect(() => {
    const controller = new AbortController();
    fetchUsage(query, page * PAGE_SIZE, { signal: controller.signal, fail: failRef.current })
      .then((p) => dispatch({ type: 'success', page: p }))
      .catch((e: Error) => {
        if (e.name !== 'AbortError') dispatch({ type: 'failure', error: e.message });
      });
    return () => controller.abort();
  }, [query, page, attempt]);

  // ONE observer, (re)attached whenever loading more becomes possible. Re-observing fires
  // an initial callback, so if the sentinel is still visible after a page lands (a short
  // page), the next page loads too. No scroll listener needed.
  const hasMore = total === null || rows.length < total;
  const canLoadMore = status === 'idle' && hasMore;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!canLoadMore || !sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // one trigger per attach
        dispatch({ type: 'loadMore' });
      },
      { root: scrollRef.current, rootMargin: '0px 0px 120px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore]);

  function sortBy(key: SortKey) {
    const dir: SortDir = query.sortKey === key && query.dir === 'asc' ? 'desc' : 'asc';
    dispatch({ type: 'query', query: { ...query, sortKey: key, dir } });
  }

  const sortedLabel = COLUMNS.find((c) => c.key === query.sortKey)!.label;

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-4 text-text-main">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Service
          <select
            value={query.service}
            onChange={(e) => dispatch({ type: 'query', query: { ...query, service: e.target.value } })}
            className="rounded-lg border border-border-strong bg-surface px-2 py-1"
          >
            <option value="all">All services</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={simulateErrors}
            onChange={(e) => {
              setSimulateErrors(e.target.checked);
              failRef.current = e.target.checked; // applies to the next request
            }}
          />
          Simulate errors
        </label>
      </div>

      <div ref={scrollRef} className="max-h-[420px] overflow-auto rounded-lg border border-border-subtle">
        <table className="w-full border-collapse text-sm">
          <caption className="p-2 text-left text-text-muted">
            Cloud usage: {rows.length}
            {total !== null && ` of ${total}`} rows, sorted by {sortedLabel} ({query.dir === 'asc' ? 'ascending' : 'descending'})
          </caption>
          <thead className="sticky top-0 bg-muted">
            <tr>
              {COLUMNS.map((col) => {
                const active = query.sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (query.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={`p-0 ${col.type === 'number' ? 'text-right' : 'text-left'}`}
                  >
                    <button type="button" onClick={() => sortBy(col.key)} className="w-full px-3 py-2 font-semibold hover:bg-surface">
                      {col.label}
                      <span aria-hidden="true" className="ml-1 inline-block w-3">
                        {active ? (query.dir === 'asc' ? '▲' : '▼') : ''}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border-subtle">
                {COLUMNS.map((col) => (
                  <td key={col.key} className={`px-3 py-2 ${col.type === 'number' ? 'text-right tabular-nums' : ''}`}>
                    {format(row, col)}
                  </td>
                ))}
              </tr>
            ))}
            {status === 'idle' && total === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="p-6 text-center text-text-muted">
                  No usage records for {query.service}.
                </td>
              </tr>
            )}
            {status === 'error' && (
              <tr>
                <td colSpan={COLUMNS.length} className="p-4 text-center text-error">
                  Couldn't load rows ({error}).{' '}
                  <button type="button" onClick={() => dispatch({ type: 'retry' })} className="underline">
                    Retry
                  </button>
                </td>
              </tr>
            )}
            {hasMore && status !== 'error' && (
              <tr ref={sentinelRef}>
                <td colSpan={COLUMNS.length} className="p-4 text-center text-text-muted">
                  {status === 'loading' ? 'Loading…' : ''}
                </td>
              </tr>
            )}
            {!hasMore && total !== 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="p-4 text-center text-text-muted">
                  All {total} rows loaded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p role="status" className="sr-only">
        {status === 'loading' ? 'Loading rows' : status === 'error' ? `Error: ${error}` : `${rows.length} rows shown`}
      </p>
    </div>
  );
}
