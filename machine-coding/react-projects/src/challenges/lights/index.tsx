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
    }, 1000);
  }, []);

  const resetGrid = () => {
    setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false)));
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Zap className="w-7 h-7 text-yellow-500 fill-yellow-500/20" />
            GLOW GRID
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Click cells to activate the pulse effect.
          </p>
        </div>
        <button 
          onClick={resetGrid}
          className="p-2.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-all shadow-sm"
        >
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="bg-white dark:bg-surface-900 p-6 rounded-[2.5rem] border border-surface-200 dark:border-surface-800 shadow-2xl">
        <div className="grid grid-cols-5 gap-3 sm:gap-4 aspect-square">
          {grid.map((row, rIdx) => 
            row.map((isActive, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => activateCell(rIdx, cIdx)}
                className={cn(
                  "relative rounded-2xl transition-all duration-300 outline-none active:scale-90 overflow-hidden",
                  "border-2",
                  isActive 
                    ? "bg-yellow-400 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.6)] scale-105 z-10" 
                    : "bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600"
                )}
              >
                {/* Glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
                
                {/* Visual texture */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-10"
                )}>
                  <Zap className={cn(
                    "w-1/3 h-1/3 transition-all truncate",
                    isActive ? "text-yellow-900 scale-125" : "text-gray-400"
                  )} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
          <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-900/70 dark:text-yellow-300/70 leading-relaxed">
            The pulse effect uses a combination of scale, shadow, and color transitions for high visual impact.
          </p>
        </div>
        <div className="flex gap-3 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-900/20">
          <Grid3X3 className="w-5 h-5 text-brand-500 shrink-0" />
          <p className="text-xs text-brand-900/70 dark:text-brand-300/70 leading-relaxed">
            State is managed via a 2D matrix with individual cell timeouts for independent animations.
          </p>
        </div>
      </div>
    </div>
  );
}
