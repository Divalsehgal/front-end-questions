import { useMemo, useState } from "react";
import { X } from "lucide-react";

const INITIAL_TEXT = "The performance of the system was the primary concern. The system should be fast, the architecture should be clean, and the code should be readable. Fast performance is the goal.";
const INITIAL_BANNED = ["the", "was", "is", "be", "and"];

/** Top `count` words by frequency (ties alphabetical), skipping banned words. */
function getFrequentWords(text: string, banned: string[], count: number): [word: string, count: number][] {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const bannedSet = new Set(banned.map((w) => w.toLowerCase())); // O(1) lookups
  const counts = new Map<string, number>();

  for (const word of words) {
    if (!bannedSet.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, count);
}

export default function FrequentWord() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [banned, setBanned] = useState(INITIAL_BANNED);
  const [draft, setDraft] = useState("");
  const [limit, setLimit] = useState(5);

  const results = useMemo(() => getFrequentWords(text, banned, limit), [text, banned, limit]);

  const addBanned = () => {
    const word = draft.trim().toLowerCase();
    if (word && !banned.includes(word)) setBanned((prev) => [...prev, word]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-text-main">Most frequent words</h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="source-text" className="text-sm font-semibold text-text-main">
              Text
            </label>
            <textarea
              id="source-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-48 w-full rounded-xl border border-border-subtle bg-surface p-4 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="banned-input" className="text-sm font-semibold text-text-main">
              Banned words
            </label>
            <ul className="flex flex-wrap gap-2">
              {banned.map((word) => (
                <li key={word} className="flex items-center gap-1 rounded-lg bg-muted py-1 pr-1 pl-3 text-sm text-text-main">
                  {word}
                  <button
                    onClick={() => setBanned((prev) => prev.filter((w) => w !== word))}
                    aria-label={`Remove ${word}`}
                    className="rounded p-1 text-text-muted hover:bg-surface hover:text-error"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <input
              id="banned-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBanned()}
              placeholder="Type a word and press Enter"
              className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-main">Top {limit}</h2>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              N
              <input
                type="number"
                min={1}
                value={limit}
                onChange={(e) => setLimit(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 rounded-lg border border-border-subtle px-2 py-1 text-center"
              />
            </label>
          </div>

          {results.length === 0 ? (
            <p className="text-sm text-text-muted">No words to count.</p>
          ) : (
            <ol className="space-y-2">
              {results.map(([word, count], i) => (
                <li key={word} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                  <span className="w-6 text-sm text-text-muted">{i + 1}.</span>
                  <span className="flex-1 font-semibold text-text-main">{word}</span>
                  <span className="text-sm text-text-muted">
                    {count} {count === 1 ? "time" : "times"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
