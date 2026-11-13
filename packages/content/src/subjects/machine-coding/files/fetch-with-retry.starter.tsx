import { useState } from 'react';

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

// Write: function useFetchWithRetry<T>({ url, retries, delay }): { data, loading, error, attempt }

export default function App() {
  // your code
  return <div className="p-6">Start building here</div>;
}
