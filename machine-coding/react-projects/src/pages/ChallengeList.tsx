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
    <div className="bg-surface-sunken selection:bg-primary/20 min-h-screen">
      {/* Header Section */}
      <header className="mx-auto max-w-7xl space-y-4 px-6 py-12">
        <div className="text-primary animate-in fade-in slide-in-from-top-4 flex items-center gap-3 duration-700">
          <Rocket className="size-8" />
          <span className="font-display text-sm font-bold tracking-widest uppercase">Platform v2.0</span>
        </div>
        <h1 className="animate-in fade-in slide-in-from-top-6 font-display text-5xl font-black tracking-tighter text-text-main delay-100 duration-700 md:text-7xl">
          Frontend <br /> <span className="text-primary">Mastery</span> Hub
        </h1>
        <p className="animate-in fade-in slide-in-from-top-8 max-w-2xl text-lg text-text-muted delay-200 duration-700">
          Level up your React skills with production-grade machine coding challenges. 
          Each project focuses on architecture, accessibility, and performance.
        </p>
      </header>

      {/* Search Bar */}
      <div className="bg-surface-sunken/80 sticky top-0 z-10 px-6 pb-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl">
          <div className="group relative">
            <Search className="group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 text-text-muted transition-colors duration-200" size={20} />
            <input 
              type="text" 
              value={inputValue} 
              onChange={searchHandler}
              placeholder="Search challenges..."
              className="focus:border-primary focus:ring-primary/10 w-full rounded-2xl border border-border-subtle bg-surface py-4 pr-4 pl-12 text-lg shadow-sm transition-all duration-300 outline-none focus:ring-4"
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <main className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.length > 0 ? (
            data.map(({ name, hint }, index) => (
              <Link
                key={name}
                to={`/react-challenge/${name}`}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6",
                  "hover:border-primary hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
                  "animate-in fade-in slide-in-from-bottom-8 duration-700"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Sparkles className="text-primary size-5" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="group-hover:text-primary font-display text-2xl font-bold text-text-main transition-colors duration-300">
                      {name}
                    </h3>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-text-muted">
                    {hint}
                  </p>
                  <div className="text-primary flex items-center pt-4 text-sm font-semibold transition-all duration-300 group-hover:gap-2">
                     Open <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full space-y-4 py-24 text-center">
              <div className="text-4xl">🔍</div>
              <h3 className="text-xl font-bold text-text-main">No challenges found</h3>
              <p className="text-text-muted">Try searching for something else!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-display text-xl font-black tracking-tighter italic">
            <div className="bg-primary size-6 rotate-12 rounded-lg" />
            DPJS
          </div>
          <p className="text-sm text-text-muted">© 2026 Machine Coding Series • Build something better.</p>
        </div>
      </footer>
    </div>
  );
}
