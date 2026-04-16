import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { 
  FileSearch, 
  Terminal, 
  Trash2, 
  Search, 
  Hash, 
  Sparkles,
  Quote,
  Filter,
  Layout
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
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-500 text-tiny font-black uppercase tracking-widest rounded-full">NLP Module</span>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase shrink-0">
            Lexicon <span className="text-brand-500">Analyzer</span>
          </h1>
          <p className="text-sm text-text-muted font-medium">Complexity: Regex Normalization & Frequency Mapping.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Editor Space */}
        <div className="space-y-8">
           <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                 </div>
                 <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Source Text</h3>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 p-6 bg-muted rounded-2xl border border-subtle text-sm outline-none focus:ring-2 ring-brand-500/20 transition-all font-medium custom-scrollbar"
              />
           </div>

           <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-error-500/10 text-error-500 rounded-2xl flex items-center justify-center">
                    <Filter className="w-5 h-5" />
                 </div>
                 <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Banned Lexicon</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                 {banned.map((word, idx) => (
                   <div key={idx} className="px-4 py-2 bg-muted border border-subtle rounded-xl flex items-center gap-2 group">
                      <span className="text-sm font-bold text-text-main">{word}</span>
                      <button 
                        onClick={() => setBanned(banned.filter((_, i) => i !== idx))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-error-500"
                      >
                         <Trash2 className="w-3 h-3" />
                      </button>
                   </div>
                 ))}
                 <input 
                   placeholder="Add word..."
                   className="px-4 py-2 bg-transparent text-sm outline-none border-b border-dashed border-subtle"
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
        <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-8 h-full">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-success-500/10 text-success-500 rounded-2xl flex items-center justify-center">
                    <Search className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Analysis Results</h3>
                    <p className="text-tiny font-bold text-success-500 uppercase">Top {limit} Occurrences</p>
                 </div>
              </div>
              <input 
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-16 p-2 bg-muted rounded-xl text-center font-black text-brand-500 outline-none"
              />
           </div>

            <div className="space-y-4">
               {results.map((word, idx) => (
                 <div 
                   key={word} 
                   className="flex items-center gap-4 p-5 bg-muted rounded-2xl border border-subtle group hover:border-brand-500/30 transition-all animate-in slide-in-from-right-4"
                   style={{ animationDelay: `${idx * 100}ms` }}
                 >
                    <div className="w-12 h-12 bg-surface rounded-xl flex flex-col items-center justify-center shadow-soft">
                       <span className="text-tiny font-black text-text-muted">#{idx + 1}</span>
                       <Hash className="w-4 h-4 text-brand-500" />
                    </div>
                    <div className="flex-1">
                       <p className="text-lg font-black text-text-main capitalize tracking-tight">{word}</p>
                       <p className="text-tiny font-bold text-text-muted uppercase tracking-widest">Matched Token</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-warning-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
