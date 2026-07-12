import React, { useState } from "react";
import { 
  Trash2, 
  Search, 
  Hash, 
  Sparkles,
  Quote,
  Filter,
} from "lucide-react";

export const hint = "Lexical analyzer for pattern frequency and noise filtering";

const INITIAL_TEXT = "The performance of the system was the primary concern. The system should be fast, the architecture should be clean, and the code should be readable. Fast performance is the goal.";
const INITIAL_BANNED = ["the", "was", "is", "be", "and"];

// --- Logic Layer ---
function getFrequentWords(text: string, banned: string[], count: number): string[] {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  const bannedSet = new Set(banned.map(w => w.toLowerCase()));
  const frequencyMap = new Map<string, number>();
  
  for (const word of words) {
    if (!bannedSet.has(word)) {
      frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
    }
  }

  return [...frequencyMap.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(entry => entry[0]);
}

export default function FrequentWord() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [banned, setBanned] = useState(INITIAL_BANNED);
  const [limit, setLimit] = useState(5);

  const results = getFrequentWords(text, banned, limit);

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] space-y-8 p-4 md:p-8">
      <div className="border-subtle flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-tiny rounded-full bg-brand-500/10 px-3 py-1 font-black tracking-widest text-brand-500 uppercase">NLP Module</span>
            <span className="size-1.5 animate-ping rounded-full bg-brand-500" />
          </div>
          <h1 className="shrink-0 text-4xl font-black tracking-tighter text-text-main uppercase md:text-5xl">
            Lexicon <span className="text-brand-500">Analyzer</span>
          </h1>
          <p className="text-sm font-medium text-text-muted">Complexity: Regex Normalization & Frequency Mapping.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
        {/* Editor Space */}
        <div className="space-y-8">
           <div className="border-subtle space-y-6 rounded-3xl border bg-surface p-8 shadow-hard">
              <div className="flex items-center gap-3">
                 <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
                    <Quote className="size-5" />
                 </div>
                 <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Source Text</h3>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border-subtle custom-scrollbar h-48 w-full rounded-2xl border bg-muted p-6 text-sm font-medium ring-brand-500/20 transition-all outline-none focus:ring-2"
              />
           </div>

           <div className="border-subtle space-y-6 rounded-3xl border bg-surface p-8 shadow-hard">
              <div className="flex items-center gap-3">
                 <div className="bg-error-500/10 text-error-500 flex size-10 items-center justify-center rounded-2xl">
                    <Filter className="size-5" />
                 </div>
                 <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Banned Lexicon</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                 {banned.map((word, idx) => (
                   <div key={idx} className="border-subtle group flex items-center gap-2 rounded-xl border bg-muted px-4 py-2">
                      <span className="text-sm font-bold text-text-main">{word}</span>
                      <button 
                        onClick={() => setBanned(banned.filter((_, i) => i !== idx))}
                        className="text-error-500 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                         <Trash2 className="size-3" />
                      </button>
                   </div>
                 ))}
                 <input 
                   placeholder="Add word..."
                   className="border-subtle border-b border-dashed bg-transparent px-4 py-2 text-sm outline-none"
                   onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !banned.includes(val)) {
                          setBanned([...banned, val]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                   }}
                 />
              </div>
           </div>
        </div>

        {/* Results Space */}
        <div className="border-subtle h-full space-y-8 rounded-3xl border bg-surface p-8 shadow-hard">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-success-500/10 text-success-500 flex size-10 items-center justify-center rounded-2xl">
                    <Search className="size-5" />
                 </div>
                 <div>
                    <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Analysis Results</h3>
                    <p className="text-tiny text-success-500 font-bold uppercase">Top {limit} Occurrences</p>
                 </div>
              </div>
              <input 
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-16 rounded-xl bg-muted p-2 text-center font-black text-brand-500 outline-none"
              />
           </div>

            <div className="space-y-4">
               {results.map((word, idx) => (
                 <div 
                   key={word} 
                   className="border-subtle group animate-in slide-in-from-right-4 flex items-center gap-4 rounded-2xl border bg-muted p-5 transition-all hover:border-brand-500/30"
                   style={{ animationDelay: `${idx * 100}ms` }}
                 >
                    <div className="flex size-12 flex-col items-center justify-center rounded-xl bg-surface shadow-soft">
                       <span className="text-tiny font-black text-text-muted">#{idx + 1}</span>
                       <Hash className="size-4 text-brand-500" />
                    </div>
                    <div className="flex-1">
                       <p className="text-lg font-black tracking-tight text-text-main capitalize">{word}</p>
                       <p className="text-tiny font-bold tracking-widest text-text-muted uppercase">Matched Token</p>
                    </div>
                    <Sparkles className="text-warning-500 size-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
