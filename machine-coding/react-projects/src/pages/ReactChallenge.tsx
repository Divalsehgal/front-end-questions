import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { challenges } from "../challenges";
import HintModal from "../components/HintModal";
import { Lightbulb, ChevronRight, Home } from "lucide-react";

export default function ReactChallenge() {
  const { name } = useParams();
  const [isHintOpen, setIsHintOpen] = useState(false);

  const challenge = challenges[name as keyof typeof challenges];
  const ChallengeComponent = challenge?.component;
  const hint = challenge?.hint;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20">
      {/* Navigation Header */}
      <nav className="border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-display font-black text-xl italic tracking-tighter hover:text-primary transition-colors duration-300 group">
              <div className="bg-primary w-5 h-5 rounded rotate-12 group-hover:rotate-45 transition-transform duration-500" />
              DPJS
            </Link>
            <div className="h-4 w-px bg-border-subtle hidden md:block" />
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black bg-surface-sunken px-2.5 py-0.5 rounded border border-border-subtle uppercase tracking-[0.2em] text-text-muted">
                 Challenge
               </span>
               <h2 className="text-lg font-black text-text-main hidden md:block tracking-tighter uppercase">{name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hint && (
              <button
                onClick={() => setIsHintOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500/10 text-brand-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-soft active:scale-95 group"
              >
                <Lightbulb size={16} className="group-hover:animate-pulse" />
                Learning Gist
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-surface-sunken border border-border-subtle" />
          </div>
        </div>
      </nav>

      {/* Breadcrumbs & Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted animate-in fade-in slide-in-from-left-4 duration-700">
          <Link to="/" className="flex items-center gap-1.5 hover:text-primary transition-colors py-1 group">
            <Home size={12} className="group-hover:-translate-y-0.5 transition-transform" />
            Home
          </Link>
          <ChevronRight size={10} className="text-border-strong" />
          <Link to="/" className="hover:text-primary transition-colors py-1">
            Challenges
          </Link>
          <ChevronRight size={10} className="text-border-strong" />
          <span className="text-text-main py-1 px-2 bg-surface-sunken rounded border border-border-subtle">
            {name}
          </span>
        </nav>

        {/* Challenge Container */}
        <div className="bg-surface rounded-3xl border border-border-subtle shadow-sm overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in zoom-in-95 duration-700 delay-100">
          <div className="flex-1">
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
        </div>
      </main>

      {/* Hint Modal */}
      {hint && (
        <HintModal 
          isOpen={isHintOpen} 
          onClose={() => setIsHintOpen(false)} 
          hint={hint} 
          challengeName={name}
        />
      )}
    </div>
  );
}
