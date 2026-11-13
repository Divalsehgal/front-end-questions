import { useState } from 'react';

const TITLES = ['India', 'Indonesia', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jamaica', 'Germany', 'Ghana', 'Greece', 'Canada', 'Chile', 'China', 'Colombia', 'France', 'Finland', 'Brazil', 'Belgium', 'Spain', 'Sweden', 'Switzerland', 'Norway', 'Netherlands', 'New Zealand', 'Nepal', 'Portugal', 'Peru', 'Poland', 'Mexico', 'Morocco', 'Kenya', 'Korea'];

function mockFetch(url: string, { signal }: { method?: string; signal: AbortSignal }) {
  const q = (new URL(url).searchParams.get('q') ?? '').toLowerCase();
  return new Promise<{ ok: boolean; json: () => Promise<unknown> }>((resolve, reject) => {
    const t = setTimeout(() => resolve({ ok: true, json: async () => ({ articles: TITLES.filter((t) => t.toLowerCase().includes(q)).map((title) => ({ title })) }) }), 250 + Math.random() * 400);
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
  });
}

export default function App() {
  // your code
  return <div className="p-6">Start building here</div>;
}
