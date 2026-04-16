import React, { useState, useEffect, useId } from "react";
import { Plus, BarChart3, CheckCircle2, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProgressBarChallenge() {
  const [progressArray, setProgressArray] = useState<{ id: string; value: string }[]>([]);
  const baseId = useId();

  const addBarHandler = () => {
    const newItem = { 
      id: `${baseId}-${Math.random().toString(36).substr(2, 9)}`, 
      value: "Loading..." 
    };
    setProgressArray((prev) => [...prev, newItem]);
  };

  const onComplete = (id: string) => {
    setProgressArray((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-8 rounded-3xl border border-border-strong shadow-sm">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-text-main flex items-center gap-3">
            <BarChart3 className="text-primary" /> Active Tasks
          </h2>
          <p className="text-text-muted mt-2">Manage multiple concurrent progress streams with real-time feedback.</p>
        </div>
        <button 
          onClick={addBarHandler}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-95 cursor-pointer"
        >
          <Plus size={20} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {progressArray.length > 0 ? (
          progressArray.map((progress) => (
            <ProgressBarItem
              key={progress.id}
              id={progress.id}
              onComplete={onComplete}
            />
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-3xl text-text-muted bg-surface-sunken">
             <BarChart3 size={48} className="opacity-20 mb-4" />
             <p className="font-semibold text-lg">No active tasks</p>
             <p className="text-sm">Click the "New Task" button to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProgressBarItemProps {
  id: string;
  onComplete: (id: string) => void;
}

const ProgressBarItem: React.FC<ProgressBarItemProps> = ({ id, onComplete }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 5; // Slower, more natural increment
        } else {
          clearInterval(interval);
          // Wait a bit before removing to show 100%
          setTimeout(() => onComplete(id), 1000);
          return 100;
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [id, onComplete]);

  return (
    <div className="group animate-in fade-in slide-in-from-right-4 duration-500 bg-surface border border-border-subtle p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {width < 100 ? (
            <Loader2 className="animate-spin text-primary" size={18} />
          ) : (
            <CheckCircle2 className="text-green-500" size={18} />
          )}
          <span className="font-bold text-text-main text-sm">Task ID: {id.split('-').pop()}</span>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
          {width}%
        </span>
      </div>

      <div className="h-4 w-full bg-surface-sunken rounded-full overflow-hidden border border-border-subtle p-0.5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out relative",
            width === 100 ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${width}%` }}
        >
          {/* Animated Sheen Overlay */}
          {width < 100 && (
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-20 animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
};

export const hint = "Advanced progress tracker managing multiple dynamic instances with Tailwind v4";
