import { useEffect, useState } from 'react';

const API = 'https://hacker-news.firebaseio.com/v0';
const PAGE_SIZE = 15;

interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
}

async function getJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (HTTP ${response.status})`);
  return response.json();
}

export default function HackerNews() {
  const [ids, setIds] = useState<number[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the stories for the next page of ids and add them to the end of the list.
  const loadPage = async (allIds: number[], alreadyLoaded: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const pageIds = allIds.slice(alreadyLoaded, alreadyLoaded + PAGE_SIZE);
      // Fetch every story of the page at the same time.
      const results = await Promise.all(pageIds.map((id) => getJson(`${API}/item/${id}.json`)));
      setStories((prev) => [...prev, ...results.filter(Boolean)]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // On mount: fetch the list of ids once, then the first page.
  useEffect(() => {
    async function start() {
      try {
        const allIds: number[] = await getJson(`${API}/topstories.json`);
        setIds(allIds);
        await loadPage(allIds, 0);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    }
    start();
  }, []);

  const hasMore = stories.length < ids.length;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-bold text-text-main">Top stories</h2>

      <ol className="space-y-2">
        {stories.map((story, i) => {
          const domain = story.url ? new URL(story.url).hostname : 'news.ycombinator.com';
          return (
            <li key={story.id} className="rounded-lg border border-border-subtle bg-surface p-3">
              <span className="mr-2 text-text-muted">{i + 1}.</span>
              {/* noopener: the new tab can't control this page through window.opener */}
              <a href={story.url ?? `https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-text-main hover:underline">
                {story.title}
              </a>
              <span className="ml-2 text-xs text-text-muted">({domain})</span>
              <p className="mt-1 text-xs text-text-muted">
                {story.score} points by {story.by}
              </p>
            </li>
          );
        })}
      </ol>

      {error && <p className="text-error">{error}</p>}
      {isLoading && <p className="text-text-muted">Loading...</p>}
      {hasMore && !isLoading && (
        <button onClick={() => loadPage(ids, stories.length)} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-text-inverted">
          Load more
        </button>
      )}
    </div>
  );
}
