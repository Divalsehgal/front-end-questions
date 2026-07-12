import React, { useState, useCallback } from "react";
import { cn } from "../../utils/cn";
import { Zap, RotateCcw, Info, Grid3X3 } from "lucide-react";

export const hint = "Interactive grid where cells glow on click and fade out after a delay";

const GRID_SIZE = 5;

export default function Lights() {
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false))
  );

  const activateCell = useCallback((r: number, c: number) => {
    // Activate
    setGrid(prev => prev.map((row, rid) => 
      row.map((active, cid) => (rid === r && cid === c ? true : active))
    ));

    // Deactivate after 1 second
    setTimeout(() => {
      setGrid(prev => prev.map((row, rid) => 
        row.map((active, cid) => (rid === r && cid === c ? false : active))
      ));
    }, 4000);
  }, []);

  const resetGrid = () => {
    setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false)));
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <Zap className="text-warning-500 fill-warning-500/20 size-7" />
            GLOW GRID
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Click cells to activate the pulse effect.
          </p>
        </div>
        <button 
          onClick={resetGrid}
          className="rounded-xl bg-muted p-2.5 shadow-soft transition-all hover:bg-muted/80"
        >
          <RotateCcw className="size-5 text-text-muted" />
        </button>
      </div>

      <div className="border-subtle rounded-3xl border bg-surface p-6 shadow-hard">
        <div className="grid aspect-square grid-cols-5 gap-3 sm:gap-4">
          {grid.map((row, rIdx) => 
            row.map((isActive, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => activateCell(rIdx, cIdx)}
                className={cn(
                  "relative overflow-hidden rounded-2xl transition-all duration-300 outline-none active:scale-90",
                  "border-2",
                  isActive 
                    ? "bg-warning-500 border-warning-500/50 z-10 scale-105 shadow-[0_0_30px_var(--color-warning-500)]/40" 
                    : "border-subtle bg-muted hover:border-brand-500"
                )}
              >
                {/* Glow effect */}
                {isActive && (
                  <div className="absolute inset-0 animate-pulse bg-white/20" />
                )}
                
                {/* Visual texture */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-10"
                )}>
                  <Zap className={cn(
                    "size-1/3 truncate transition-all",
                    isActive ? "text-warning-950 scale-125" : "text-text-muted"
                  )} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-warning-500/5 border-warning-500/10 flex gap-3 rounded-2xl border p-4">
          <Info className="text-warning-500 size-5 shrink-0" />
          <p className="text-tiny leading-relaxed text-text-main/70">
            The pulse effect uses a combination of scale, shadow, and color transitions for high visual impact.
          </p>
        </div>
        <div className="flex gap-3 rounded-2xl border border-brand-500/10 bg-brand-500/5 p-4">
          <Grid3X3 className="size-5 shrink-0 text-brand-500" />
          <p className="text-tiny leading-relaxed text-text-main/70">
            State is managed via a 2D matrix with individual cell timeouts for independent animations.
          </p>
        </div>
      </div>
    </div>
  );
}
