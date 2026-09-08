import { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  MessageSquare,
  ChevronUp,
  Clock,
  Loader2,
  TrendingUp,
  Newspaper,
} from "lucide-react";

export const hint =
  "Advanced Hacker News client with real-time fetching and infinite scroll";

interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export default function HackerNews() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
      );
      const ids = await response.json();

      const topIds = ids.slice(0, 30); // Top 30 for demo
      const storyPromises = topIds.map((id: number) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (res) => res.json(),
        ),
      );

      const results = await Promise.all(storyPromises);
      setStories(results.filter((s) => s?.type === "story"));
      setError(null);
    } catch (err) {
      alert(err);
      setError("Failed to fetch stories from Hacker News API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <Newspaper className="size-7 text-brand-500" />
            Hacker News
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Real-time feed from the pulse of tech.
          </p>
        </div>
        <button
          onClick={fetchStories}
          disabled={isLoading}
          className="rounded-xl bg-muted p-2.5 shadow-soft transition-all hover:bg-muted/80 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <TrendingUp className="size-5 text-brand-500" />
          )}
        </button>
      </div>

      {error ? (
        <div className="space-y-4 rounded-3xl border-2 border-error/20 bg-error/10 p-8 text-center">
          <p className="font-bold text-error">{error}</p>
          <button
            onClick={fetchStories}
            className="rounded-xl bg-error px-6 py-2 font-bold text-text-inverted shadow-soft shadow-error/20"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading && stories.length === 0
            ? new Array(10)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 w-full animate-pulse rounded-2xl bg-muted"
                  />
                ))
            : stories.map((story, idx) => (
                <StoryCard key={story.id} story={story} index={idx + 1} />
              ))}
        </div>
      )}
    </div>
  );
}

function StoryCard({
  story,
  index,
}: Readonly<{ story: Story; index: number }>) {
  const domain = story.url
    ? new URL(story.url).hostname.replace("www.", "")
    : "";

  return (
    <div className="group border-subtle animate-in fade-in slide-in-from-bottom-2 rounded-2xl border bg-surface p-4 transition-all duration-500 hover:border-brand-500/20 hover:shadow-hard sm:p-5">
      <div className="flex gap-4">
        {/* Rank / Upvotes */}
        <div className="flex min-w-12 flex-col items-center justify-center rounded-xl bg-muted px-2 py-1 transition-colors group-hover:bg-brand-500/10">
          <ChevronUp className="size-4 text-brand-500" />
          <span className="mt-0.5 text-sm leading-none font-black text-text-main">
            {story.score}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col gap-1">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 text-base leading-tight font-bold text-text-main transition-colors hover:text-brand-500 sm:text-lg"
            >
              {story.title}
            </a>
            {domain && (
              <span className="text-tiny flex items-center gap-1 font-bold tracking-widest text-text-muted uppercase sm:text-xs">
                <ExternalLink className="size-3" />
                {domain}
              </span>
            )}
          </div>

          <div className="text-tiny flex flex-wrap items-center gap-x-4 gap-y-2 font-semibold text-text-muted sm:text-xs">
            <span className="flex cursor-help items-center gap-1 transition-colors hover:text-brand-500">
              <TrendingUp className="size-3" />
              {story.by}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(story.time * 1000).toLocaleDateString()}
            </span>
            <button className="flex items-center gap-1 transition-colors hover:text-brand-500">
              <MessageSquare className="size-3" />
              {story.descendants || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
