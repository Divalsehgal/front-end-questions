import { useEffect, useState } from 'react';

// A flaky stand-in API: fails about 60% of the time, honours AbortSignal.
function flakyFetch(url: string, { signal }: { signal?: AbortSignal } = {}): Promise<Response> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      if (Math.random() < 0.6) resolve(new Response('server error', { status: 500 }));
      else resolve(new Response(JSON.stringify({ url, at: new Date().toLocaleTimeString() }), { status: 200 }));
    }, 400);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

type FetchOptions = { url: string; retries: number; delay: number };

function useFetchWithRetry<T>({ url, retries, delay }: FetchOptions) {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    setLoading(true);
    setError(null);

    const fetchData = async (retriesLeft: number) => {
      try {
        const response = await flakyFetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`); // fetch doesn't reject on 500
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) {
          return; // unmounted, or the url changed: stay quiet
        }
        if (retriesLeft === 0) {
          setError((err as Error).message);
          setLoading(false);
          return;
        }
        timer = setTimeout(() => fetchData(retriesLeft - 1), delay); // wait, then try again
      }
    };

    fetchData(retries);

    // Cancel the request that is running AND the retry that is waiting.
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, retries, delay]);

  return { data, loading, error };
}

export default function App() {
  const [run, setRun] = useState(0);
  const { data, loading, error } = useFetchWithRetry<{ url: string; at: string }>({
    url: `/api/items?run=${run}`,
    retries: 3,
    delay: 500,
  });

  return (
    <div className="space-y-3 p-6">
      <button onClick={() => setRun((r) => r + 1)} className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-main">
        Fetch again
      </button>
      {loading && <p className="text-text-muted">Loading...</p>}
      {error && <p className="text-error">Failed after retries: {error}</p>}
      {data && !loading && <pre className="rounded bg-muted p-3 text-sm text-text-main">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
