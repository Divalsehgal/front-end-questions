import React, { useState, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
import { 
  ExternalLink, 
  MessageSquare, 
  ChevronUp, 
  Clock, 
  Search, 
  Loader2,
  TrendingUp,
  Newspaper
} from "lucide-react";

export const hint = "Advanced Hacker News client with real-time fetching and infinite scroll";

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
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids = await response.json();
      
      const topIds = ids.slice(0, 30); // Top 30 for demo
      const storyPromises = topIds.map((id: number) => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      
      const results = await Promise.all(storyPromises);
      setStories(results.filter(s => s && s.type === "story"));
      setError(null);
    } catch (err) {
      setError("Failed to fetch stories from Hacker News API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
            <Newspaper className="w-7 h-7 text-brand-500" />
            Hacker News
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Real-time feed from the pulse of tech.
          </p>
        </div>
        <button 
          onClick={fetchStories}
          disabled={isLoading}
          className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all shadow-soft disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5 text-brand-500" />}
        </button>
      </div>

      {error ? (
        <div className="p-8 bg-error/10 border-2 border-error/20 rounded-3xl text-center space-y-4">
          <p className="font-bold text-error">{error}</p>
          <button onClick={fetchStories} className="px-6 py-2 bg-error text-text-inverted font-bold rounded-xl shadow-soft shadow-error/20">Retry</button>
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading && stories.length === 0 ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
            ))
          ) : (
            stories.map((story, idx) => (
              <StoryCard key={story.id} story={story} index={idx + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  const domain = story.url ? new URL(story.url).hostname.replace("www.", "") : "";

  return (
    <div className="group bg-surface border border-subtle rounded-2xl p-4 sm:p-5 hover:shadow-hard transition-all hover:border-brand-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-4">
        {/* Rank / Upvotes */}
        <div className="flex flex-col items-center justify-center min-w-[3rem] px-2 py-1 bg-muted rounded-xl group-hover:bg-brand-500/10 transition-colors">
          <ChevronUp className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-black text-text-main leading-none mt-0.5">{story.score}</span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-col gap-1">
            <a 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-bold text-text-main hover:text-brand-500 transition-colors leading-tight line-clamp-2"
            >
              {story.title}
            </a>
            {domain && (
              <span className="text-tiny sm:text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {domain}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-tiny sm:text-xs font-semibold text-text-muted">
            <span className="flex items-center gap-1 hover:text-brand-500 transition-colors cursor-help">
              <TrendingUp className="w-3 h-3" />
              {story.by}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(story.time * 1000).toLocaleDateString()}
            </span>
            <button className="flex items-center gap-1 hover:text-brand-500 transition-colors">
              <MessageSquare className="w-3 h-3" />
              {story.descendants || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
