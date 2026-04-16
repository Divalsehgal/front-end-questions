import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { 
  BarChart3, 
  Search, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Hash,
  Filter
} from "lucide-react";

export const hint = "Text analyzer that identifies the most frequent word while filtering out banned terms and punctuation";

export default function FrequentWordChallenge() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. The fox was very fast, but the dog was faster than the fox.");
  const [bannedInput, setBannedInput] = useState("the, was, very");

  const results = useMemo(() => {
    if (!text.trim()) return null;

    const bannedWords = bannedInput
      .split(",")
      .map(w => w.trim().toLowerCase())
      .filter(w => w !== "");

    // Clean text: remove non-alphanumeric characters except spaces
    const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();
    const words = cleanText.split(/\s+/).filter(w => w !== "");

    const counts: Record<string, number> = {};
    words.forEach(word => {
      if (!bannedWords.includes(word)) {
        counts[word] = (counts[word] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const mostFrequent = sorted[0];

    return {
      mostFrequent,
      allCounts: sorted,
      totalWords: words.length,
      filteredWords: Object.keys(counts).length
    };
  }, [text, bannedInput]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
          <BarChart3 className="w-7 h-7 text-brand-500" />
          LEXICON ANALYZER
        </h2>
        <p className="text-sm font-medium text-gray-500">
          Identify key terminologies and word distribution patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Source Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your content here..."
              className="w-full h-48 p-5 bg-white dark:bg-surface-900 border-2 border-surface-100 dark:border-surface-800 rounded-[2rem] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm font-medium leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Banned Words (Comma separated)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </div>
              <input
                value={bannedInput}
                onChange={(e) => setBannedInput(e.target.value)}
                placeholder="the, a, is..."
                className="w-full pl-11 pr-4 py-4 bg-white dark:bg-surface-900 border-2 border-surface-100 dark:border-surface-800 rounded-2xl outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-brand-500 rounded-[2rem] text-white shadow-xl shadow-brand-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Search className="w-12 h-12" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Most Frequent</p>
                  <h3 className="text-2xl font-black truncate tracking-tighter uppercase">{results.mostFrequent?.[0] || "N/A"}</h3>
                  <div className="mt-2 flex items-center gap-1.5 bg-white/20 w-fit px-2 py-0.5 rounded-lg text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    FOUND {results.mostFrequent?.[1] || 0} TIMES
                  </div>
                </div>

                <div className="p-5 bg-surface-50 dark:bg-surface-900 rounded-[2rem] border border-surface-100 dark:border-surface-800 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Hash className="w-12 h-12" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Words</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{results.totalWords}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{results.filteredWords} unique</p>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-[2rem] p-6 shadow-2xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Top Distributions</h4>
                <div className="space-y-3">
                  {results.allCounts.length > 0 ? (
                    results.allCounts.map(([word, count], idx) => (
                      <div key={word} className="group flex items-center gap-4 px-2 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="w-8 text-[10px] font-black text-gray-300 group-hover:text-brand-500 transition-colors">0{idx + 1}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="uppercase tracking-wide text-gray-700 dark:text-gray-300">{word}</span>
                            <span className="text-brand-500">{count}</span>
                          </div>
                          <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 rounded-full transition-all duration-1000 delay-300" 
                              style={{ width: `${(count / results.mostFrequent[1]) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 italic text-sm">No valid words found.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-surface-50 dark:bg-surface-900/50 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-[3rem] space-y-4">
              <AlertCircle className="w-12 h-12 text-surface-300" />
              <div className="space-y-1">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Awaiting Data</p>
                <p className="text-xs text-gray-500">Provide source text for high-fidelity analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
