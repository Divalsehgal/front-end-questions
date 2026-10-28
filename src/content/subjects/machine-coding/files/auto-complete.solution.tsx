import { useEffect, useState, type FormEvent } from "react";

// mockFetch is a stand-in API: random latency, { articles: [{ title }] } responses, honours AbortSignal.
const TITLES = ['India', 'Indonesia', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jamaica', 'Germany', 'Ghana', 'Greece', 'Canada', 'Chile', 'China', 'Colombia', 'France', 'Finland', 'Brazil', 'Belgium', 'Spain', 'Sweden', 'Switzerland', 'Norway', 'Netherlands', 'New Zealand', 'Nepal', 'Portugal', 'Peru', 'Poland', 'Mexico', 'Morocco', 'Kenya', 'Korea'];
function mockFetch(url: string, { signal }: { method?: string; signal: AbortSignal }) {
  const q = (new URL(url).searchParams.get('q') ?? '').toLowerCase();
  return new Promise<{ ok: boolean; json: () => Promise<unknown> }>((resolve, reject) => {
    const t = setTimeout(() => resolve({ ok: true, json: async () => ({ articles: TITLES.filter((t) => t.toLowerCase().includes(q)).map((title) => ({ title })) }) }), 250 + Math.random() * 400);
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
  });
}

const SEARCH_URL = "https://example.com/search";
const DEBOUNCE_MS = 300;

export default function App() {
  return (
    <div className="p-6">
      <AutoComplete label="Country" />
    </div>
  );
}

function AutoComplete({ label }: Readonly<{ label: string }>) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const trimmedQuery = debouncedQuery.trim();

  // Debounce: wait until the user stops typing for DEBOUNCE_MS.
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    if (!trimmedQuery) {
      setData([]);
      setError("");
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const url = new URL(SEARCH_URL);
        url.searchParams.set("q", trimmedQuery);
        const response = await mockFetch(url.toString(), { signal: controller.signal });
        if (!response.ok) throw new Error("Request failed");
        const result = (await response.json()) as { articles?: { title?: string }[] };
        const titles = (result.articles ?? []).map((article) => article.title ?? "").filter(Boolean);
        setData(titles);
      } catch {
        if (!controller.signal.aborted) {
          setData([]);
          setError("Unable to load suggestions right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchData();
    // A new query aborts the old request, so a slow old response can't overwrite a newer one.
    return () => controller.abort();
  }, [trimmedQuery]);

  // Matches that START with the query come first, then the ones that contain it.
  const lowerQuery = trimmedQuery.toLowerCase();
  const startsWithMatches = data.filter((item) => item.toLowerCase().startsWith(lowerQuery));
  const includesMatches = data.filter(
    (item) => !item.toLowerCase().startsWith(lowerQuery) && item.toLowerCase().includes(lowerQuery),
  );
  const suggestions = [...startsWithMatches, ...includesMatches];

  const showDropdown = Boolean(query && suggestions.length > 0);
  const showEmptyState = Boolean(trimmedQuery && query.trim() === trimmedQuery && !loading && !error && suggestions.length === 0);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(query.trim());
  };

  return (
    <form onSubmit={submitHandler} className="mx-auto grid max-w-md gap-3">
      <label htmlFor="auto-complete" className="font-semibold text-text-main">
        {label}
      </label>
      <div className="relative">
        <input
          id="auto-complete"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries"
          className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-text-main"
        />
        {showDropdown && (
          <ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-lg border border-border-subtle bg-surface p-1 shadow-hard">
            {suggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => setQuery(item)}
                  className="w-full rounded px-3 py-2 text-left text-sm text-text-main hover:bg-muted"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
        {showEmptyState && (
          <p className="absolute inset-x-0 top-full mt-1 rounded-lg border border-border-subtle bg-surface p-3 text-sm text-text-muted">
            No results
          </p>
        )}
      </div>
      {loading && <p className="text-sm text-text-muted">Loading…</p>}
      {error && <p className="text-sm text-error">{error}</p>}
      <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-text-inverted">
        Search
      </button>
    </form>
  );
}
