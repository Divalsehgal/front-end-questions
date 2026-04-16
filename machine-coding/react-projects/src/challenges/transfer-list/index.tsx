import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronsRight, 
  ChevronsLeft,
  ArrowRightLeft,
  Search,
  Check
} from "lucide-react";

export const hint = "Transfer items between two lists with bulk movement and individual selection";

interface Item {
  id: number;
  label: string;
}

const INITIAL_LEFT: Item[] = [
  { id: 1, label: "React Native" },
  { id: 2, label: "Advanced TypeScript" },
  { id: 3, label: "Node.js Performance" },
  { id: 4, label: "Vite Oxide Engine" },
  { id: 5, label: "Base UI Primitives" },
];

const INITIAL_RIGHT: Item[] = [
  { id: 6, label: "Tailwind v4" },
  { id: 7, label: "Next.js App Router" },
];

export default function TransferList() {
  const [leftItems, setLeftItems] = useState<Item[]>(INITIAL_LEFT);
  const [rightItems, setRightItems] = useState<Item[]>(INITIAL_RIGHT);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const transferRight = () => {
    const toMove = leftItems.filter(item => selected.includes(item.id));
    setRightItems(prev => [...prev, ...toMove].sort((a, b) => a.id - b.id));
    setLeftItems(prev => prev.filter(item => !selected.includes(item.id)));
    setSelected([]);
  };

  const transferLeft = () => {
    const toMove = rightItems.filter(item => selected.includes(item.id));
    setLeftItems(prev => [...prev, ...toMove].sort((a, b) => a.id - b.id));
    setRightItems(prev => prev.filter(item => !selected.includes(item.id)));
    setSelected([]);
  };

  const moveAllRight = () => {
    setRightItems(prev => [...prev, ...leftItems].sort((a, b) => a.id - b.id));
    setLeftItems([]);
    setSelected([]);
  };

  const moveAllLeft = () => {
    setLeftItems(prev => [...prev, ...rightItems].sort((a, b) => a.id - b.id));
    setRightItems([]);
    setSelected([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
          <ArrowRightLeft className="w-7 h-7 text-brand-500" />
          Transfer Hub
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Orchestrate data flow between environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Left Panel */}
        <ListPanel 
          title="Staging Area" 
          items={leftItems} 
          selected={selected} 
          onToggle={toggleSelection} 
        />

        {/* Controls */}
        <div className="flex md:flex-col gap-2 p-2 bg-muted rounded-3xl border border-subtle h-fit">
          <ControlButton onClick={transferRight} icon={<ChevronRight />} disabled={!leftItems.some(i => selected.includes(i.id))} />
          <ControlButton onClick={moveAllRight} icon={<ChevronsRight />} disabled={leftItems.length === 0} />
          <ControlButton onClick={transferLeft} icon={<ChevronLeft />} disabled={!rightItems.some(i => selected.includes(i.id))} />
          <ControlButton onClick={moveAllLeft} icon={<ChevronsLeft />} disabled={rightItems.length === 0} />
        </div>

        {/* Right Panel */}
        <ListPanel 
          title="Production Env" 
          items={rightItems} 
          selected={selected} 
          onToggle={toggleSelection} 
          variant="highlight"
        />
      </div>
    </div>
  );
}

function ListPanel({ title, items, selected, onToggle, variant = "default" }: any) {
  return (
    <div className={cn(
      "bg-surface rounded-3xl border-2 shadow-hard overflow-hidden flex flex-col h-[400px]",
      variant === "highlight" ? "border-brand-500/20" : "border-subtle"
    )}>
      <div className={cn(
        "px-6 py-4 flex items-center justify-between border-b",
        variant === "highlight" ? "bg-brand-500/5 border-brand-500/10" : "bg-muted border-subtle"
      )}>
        <span className="text-tiny font-black uppercase tracking-widest text-text-muted/50">{title}</span>
        <span className="text-tiny font-black px-2 py-0.5 bg-muted border border-subtle rounded-full text-text-muted/60">{items.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted/20 space-y-2">
            <Search className="w-8 h-8 opacity-20" />
            <p className="text-tiny font-black uppercase tracking-widest opacity-40">No items</p>
          </div>
        ) : (
          items.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all group uppercase tracking-tight",
                selected.includes(item.id)
                  ? "bg-brand-500 text-text-inverted shadow-soft shadow-brand-500/20 scale-[1.02]"
                  : "hover:bg-muted text-text-muted group-hover:text-text-main"
              )}
            >
              <span className="truncate">{item.label}</span>
              {selected.includes(item.id) && <Check className="w-4 h-4 animate-in zoom-in" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ControlButton({ onClick, icon, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-3 rounded-2xl transition-all shadow-soft active:scale-90 border",
        disabled 
          ? "bg-muted text-text-muted/20 border-transparent opacity-50 cursor-not-allowed" 
          : "bg-surface border-subtle text-brand-500 hover:bg-brand-500 hover:text-text-inverted hover:border-brand-500 shadow-soft"
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}
