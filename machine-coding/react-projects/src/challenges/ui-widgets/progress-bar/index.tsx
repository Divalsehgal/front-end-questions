import React, { useState, useEffect } from "react";
import { Plus, Layout, Zap, Layers, ListOrdered, Sparkles } from "lucide-react";
import { cn } from "../../../utils/cn";

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
    <div className="animate-in fade-in mx-auto max-w-2xl space-y-8 p-8 duration-500">
      {/* Mode Selector */}
      <div className="bg-surface-sunken no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-border-subtle p-1.5">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black tracking-widest whitespace-nowrap uppercase transition-all",
                isActive 
                  ? "border border-border-subtle bg-surface text-brand-500 shadow-soft" 
                  : "text-text-muted hover:bg-surface/50 hover:text-text-main"
              )}
            >
              <Icon size={14} className={cn(isActive && "animate-pulse")} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="border-subtle flex flex-col justify-between gap-6 rounded-3xl border bg-surface p-8 shadow-soft md:flex-row md:items-center">
        <div className="space-y-1">
          <h2 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-text-main">
            <Layout className="size-8 text-brand-500" />
            PROGRESS BARS
          </h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-text-muted uppercase">
            Mode: {mode.toUpperCase()} logic enabled
          </p>
        </div>
        <button
          onClick={createProgressBar}
          className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-brand-500 px-8 py-4 font-bold text-white shadow-hard shadow-brand-500/20 transition-all hover:bg-brand-600 active:scale-95"
        >
          <Plus size={20} /> Add Bar
        </button>
      </div>

      {/* Progress Container */}
      <div className="bg-surface-muted/50 border-subtle flex min-h-[240px] flex-col gap-4 rounded-[2rem] border p-6">
        {progress.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-2 text-text-muted opacity-50">
            <div className="bg-surface-sunken rounded-full border border-dashed border-border-subtle p-4">
              <Plus size={48} strokeWidth={1} />
            </div>
            <p className="text-sm font-bold tracking-tight">No active bars in {mode} mode</p>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.map((p) => (
              <div
                key={p.id}
                className="shadow-inner-soft animate-in slide-in-from-left-4 fade-in flex h-6 overflow-hidden rounded-full border border-border-subtle bg-surface p-1 duration-300"
              >
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-75"
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
