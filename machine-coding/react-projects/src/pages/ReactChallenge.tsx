import React from "react";
import { Link, useParams } from "react-router-dom";
import { challenges } from "../challenges";

export default function ReactChallenge() {
  const { name } = useParams();

  const challenge = challenges[name as keyof typeof challenges];
  const ChallengeComponent = challenge?.component;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20">
      {/* Navigation Header */}
      <nav className="border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-black text-xl italic tracking-tighter hover:text-primary transition-colors duration-300">
            <div className="bg-primary w-5 h-5 rounded rotate-12" />
            DPJS
          </Link>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold bg-surface-sunken px-3 py-1 rounded-full border border-border-subtle uppercase tracking-wider text-text-muted">
               Challenge
             </span>
             <h2 className="text-lg font-bold text-text-main hidden md:block">{name}</h2>
          </div>
        </div>
      </nav>

      {/* Challenge Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="bg-surface rounded-3xl border border-border-subtle shadow-sm overflow-hidden min-h-[600px]">
          {ChallengeComponent ? (
            <ChallengeComponent />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-24 text-center">
              <span className="text-4xl mb-4">⚠️</span>
              <h1 className="text-2xl font-bold text-text-main">Challenge not found</h1>
              <p className="text-text-muted mt-2">The challenge you're looking for doesn't exist.</p>
              <Link to="/" className="mt-6 text-primary font-bold hover:underline">Return to Hub</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
