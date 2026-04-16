import { Link } from "react-router-dom";
import { challenges, challengeNames } from "../challenges";
import React, { useState, useMemo } from "react";
import { Search, Rocket, Sparkles, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ChallengeName = (typeof challengeNames)[number];

export default function ChallengeList() {
  const allChallenges = useMemo(() => {
    return Object.entries(challenges).map(([name, data]) => ({
      name,
      hint: data.hint
    }));
  }, []);

  const [data, setData] = useState(allChallenges);
  const [inputValue, setInputValue] = useState("");

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val) {
      setData(
        allChallenges.filter((challenge) =>
          challenge.name.toLowerCase().includes(val.toLowerCase())
        )
      );
    } else {
      setData(allChallenges);
    }
  };

  return (
    <div className="min-h-screen bg-surface-sunken selection:bg-primary/20">
      {/* Header Section */}
      <header className="py-12 px-6 max-w-7xl mx-auto space-y-4">
        <div className="flex items-center gap-3 text-primary animate-in fade-in slide-in-from-top-4 duration-700">
          <Rocket className="w-8 h-8" />
          <span className="font-display font-bold text-sm tracking-widest uppercase">Platform v2.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-text-main animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
          Frontend <br /> <span className="text-primary">Mastery</span> Hub
        </h1>
        <p className="text-lg text-text-muted max-w-2xl animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
          Level up your React skills with production-grade machine coding challenges. 
          Each project focuses on architecture, accessibility, and performance.
        </p>
      </header>

      {/* Search Bar */}
      <div className="px-6 sticky top-0 z-10 bg-surface-sunken/80 backdrop-blur-md pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors duration-200" size={20} />
            <input 
              type="text" 
              value={inputValue} 
              onChange={searchHandler}
              placeholder="Search challenges..."
              className="w-full bg-surface border border-border-subtle rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <main className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map(({ name, hint }, index) => (
              <Link
                key={name}
                to={`/react-challenge/${name}`}
                className={cn(
                  "group relative p-6 bg-surface border border-border-subtle rounded-3xl overflow-hidden",
                  "hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1",
                  "animate-in fade-in slide-in-from-bottom-8 duration-700"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="text-primary w-5 h-5" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-display font-bold text-text-main group-hover:text-primary transition-colors duration-300">
                      {name}
                    </h3>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
                    {hint}
                  </p>
                  <div className="pt-4 flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                    Start Challenge <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="text-xl font-bold text-text-main">No challenges found</h3>
              <p className="text-text-muted">Try searching for something else!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-display font-black text-xl italic tracking-tighter">
            <div className="bg-primary w-6 h-6 rounded-lg rotate-12" />
            DPJS
          </div>
          <p className="text-text-muted text-sm">© 2026 Machine Coding Series • Build something better.</p>
        </div>
      </footer>
    </div>
  );
}
