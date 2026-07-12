import  { useState } from "react";
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
    <div className="selection:bg-primary/20 min-h-screen bg-surface">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="hover:text-primary group flex items-center gap-2 font-display text-xl font-black tracking-tighter italic transition-colors duration-300">
              <div className="bg-primary size-5 rotate-12 rounded transition-transform duration-500 group-hover:rotate-45" />
              DPJS
            </Link>
            <div className="hidden h-4 w-px bg-border-subtle md:block" />
            <div className="flex items-center gap-3">
               <span className="bg-surface-sunken rounded border border-border-subtle px-2.5 py-0.5 text-[10px] font-black tracking-[0.2em] text-text-muted uppercase">
                 Challenge
               </span>
               <h2 className="hidden text-lg font-black tracking-tighter text-text-main uppercase md:block">{name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hint && (
              <button
                onClick={() => setIsHintOpen(true)}
                className="group flex items-center gap-2 rounded-xl bg-brand-500/10 px-5 py-2.5 text-xs font-black tracking-widest text-brand-500 uppercase shadow-soft transition-all hover:bg-brand-500 hover:text-white active:scale-95"
              >
                <Lightbulb size={16} className="group-hover:animate-pulse" />
                Learning Gist
              </button>
            )}
            <div className="bg-surface-sunken size-8 rounded-full border border-border-subtle" />
          </div>
        </div>
      </nav>

      {/* Breadcrumbs & Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="animate-in fade-in slide-in-from-left-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-text-muted uppercase duration-700">
          <Link to="/" className="hover:text-primary group flex items-center gap-1.5 py-1 transition-colors">
            <Home size={12} className="transition-transform group-hover:-translate-y-0.5" />
            Home
          </Link>
          <ChevronRight size={10} className="text-border-strong" />
          <Link to="/" className="hover:text-primary py-1 transition-colors">
            Challenges
          </Link>
          <ChevronRight size={10} className="text-border-strong" />
          <span className="bg-surface-sunken rounded border border-border-subtle px-2 py-1 text-text-main">
            {name}
          </span>
        </nav>

        {/* Challenge Container */}
        <div className="animate-in fade-in zoom-in-95 relative flex min-h-150 flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm delay-100 duration-700">
          <div className="flex-1">
            {ChallengeComponent ? (
              <ChallengeComponent />
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-24 text-center">
                <span className="mb-4 text-4xl">⚠️</span>
                <h1 className="text-2xl font-bold text-text-main">Challenge not found</h1>
                <p className="mt-2 text-text-muted">The challenge you're looking for doesn't exist.</p>
                <Link to="/" className="text-primary mt-6 font-bold hover:underline">Return to Hub</Link>
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
