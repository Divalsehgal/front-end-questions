import React, { useState, useEffect } from "react";
import { Plus, Layout, Zap, Layers, ListOrdered, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";

type Mode = 'normal' | 'pop' | 'sequential' | 'concurrent';

export const hint = `
### Implementation Variants:
1. **Normal**: Every bar added starts filling independently. Use a simple \`map\` to update all elements in state.
2. **Auto-Pop**: Independent filling, but items are removed from the list upon reaching 100%. Filter the state in the next interval tick.
3. **Sequential**: Only one bar fills at a time. Use \`findIndex\` to target the first incomplete item and only update that specific index.
4. **Concurrent (3)**: Up to 3 bars fill simultaneously. Identify the first 3 incomplete indices and update only those.
`;

export default function ProgressBarChallenge() {
  const [progress, setProgress] = useState<{ id: string; flex: number }[]>([]);
  const [mode, setMode] = useState<Mode>('normal');

  const intervals = 50; // ms
  const totalDuration = 2000;
  const increment = intervals / totalDuration;

  const createProgressBar = () => {
    const progressBar = {
      id: crypto.randomUUID(),
      flex: 0,
    };
    setProgress((prev) => [...prev, progressBar]);
  };

  // Reset progress when mode changes
  useEffect(() => {
    setProgress([]);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (progress.length === 0) return;

    interval = setInterval(() => {
      setProgress((prev) => {
        // Logic branches based on active mode
        let activeIndices: number[] = [];
        switch (mode) {
          case 'normal':
          case 'pop':
            // Everyone moves
            activeIndices = prev.map((_, i) => i);
            break;
          case 'sequential':
            // Only the first incomplete moves
            const firstIncomplete = prev.findIndex((p) => p.flex < 1);
            if (firstIncomplete !== -1) activeIndices = [firstIncomplete];
            break;
          case 'concurrent':
            // First 3 incomplete move
            activeIndices = prev
              .map((p, index) => ({ flex: p.flex, index }))
              .filter((p) => p.flex < 1)
              .slice(0, 3)
              .map((p) => p.index);
            break;
          default:
            activeIndices = [];
        }

        const nextProgress = prev.map((p, i) => {
          if (!activeIndices.includes(i)) return p;
          return {
            ...p,
            flex: Math.min(p.flex + increment, 1),
          };
        });

        // SPECIAL CASE: Auto-Pop Mode
        if (mode === 'pop') {
          return nextProgress.filter(p => p.flex < 1);
        }

        return nextProgress;
      });
    }, intervals);

    // Stop interval if all are done (except for pop mode which clears itself)
    if (mode !== 'pop' && progress.every((p) => Number(p.flex) >= 1)) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [progress, mode, increment]);

  const modes: { id: Mode; label: string; icon: any }[] = [
    { id: 'normal', label: 'Normal', icon: Zap },
    { id: 'pop', label: 'Auto-Pop', icon: Sparkles },
    { id: 'sequential', label: 'Sequential', icon: ListOrdered },
    { id: 'concurrent', label: 'Limit (3)', icon: Layers },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      {/* Mode Selector */}
      <div className="bg-surface-sunken p-1.5 rounded-2xl border border-border-subtle flex gap-2 overflow-x-auto no-scrollbar">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                isActive 
                  ? "bg-surface text-brand-500 shadow-soft border border-border-subtle" 
                  : "text-text-muted hover:text-text-main hover:bg-surface/50"
              )}
            >
              <Icon size={14} className={cn(isActive && "animate-pulse")} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-8 rounded-3xl border border-subtle shadow-soft">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-text-main flex items-center gap-3 tracking-tighter">
            <Layout className="w-8 h-8 text-brand-500" />
            PROGRESS BARS
          </h2>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Mode: {mode.toUpperCase()} logic enabled
          </p>
        </div>
        <button
          onClick={createProgressBar}
          className="flex items-center gap-2 px-8 py-4 bg-brand-500 text-white font-bold rounded-2xl hover:bg-brand-600 transition-all shadow-hard shadow-brand-500/20 active:scale-95 flex-shrink-0"
        >
          <Plus size={20} /> Add Bar
        </button>
      </div>

      {/* Progress Container */}
      <div className="flex flex-col gap-4 bg-surface-muted/50 p-6 rounded-[2rem] border border-subtle min-h-[240px]">
        {progress.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50 space-y-2">
            <div className="p-4 rounded-full bg-surface-sunken border border-dashed border-border-subtle">
              <Plus size={48} strokeWidth={1} />
            </div>
            <p className="font-bold text-sm tracking-tight">No active bars in {mode} mode</p>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.map((p) => (
              <div
                key={p.id}
                className="bg-surface border border-border-subtle p-1 rounded-full overflow-hidden shadow-inner-soft h-6 flex animate-in slide-in-from-left-4 fade-in duration-300"
              >
                <div
                  className="bg-brand-500 rounded-full h-full transition-all duration-75"
                  style={{
                    flex: p.flex,
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
