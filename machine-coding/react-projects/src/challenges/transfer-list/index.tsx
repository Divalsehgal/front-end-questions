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
    <div className="mx-auto max-w-4xl space-y-8 p-6 pb-20">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
          <ArrowRightLeft className="size-7 text-brand-500" />
          Transfer Hub
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Orchestrate data flow between environments.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        {/* Left Panel */}
        <ListPanel 
          title="Staging Area" 
          items={leftItems} 
          selected={selected} 
          onToggle={toggleSelection} 
        />

        {/* Controls */}
        <div className="border-subtle flex h-fit gap-2 rounded-3xl border bg-muted p-2 md:flex-col">
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
      "flex h-[400px] flex-col overflow-hidden rounded-3xl border-2 bg-surface shadow-hard",
      variant === "highlight" ? "border-brand-500/20" : "border-subtle"
    )}>
      <div className={cn(
        "flex items-center justify-between border-b px-6 py-4",
        variant === "highlight" ? "border-brand-500/10 bg-brand-500/5" : "border-subtle bg-muted"
      )}>
        <span className="text-tiny font-black tracking-widest text-text-muted/50 uppercase">{title}</span>
        <span className="text-tiny border-subtle rounded-full border bg-muted px-2 py-0.5 font-black text-text-muted/60">{items.length}</span>
      </div>
      
      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-text-muted/20">
            <Search className="size-8 opacity-20" />
            <p className="text-tiny font-black tracking-widest uppercase opacity-40">No items</p>
          </div>
        ) : (
          items.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black tracking-tight uppercase transition-all",
                selected.includes(item.id)
                  ? "scale-[1.02] bg-brand-500 text-text-inverted shadow-soft shadow-brand-500/20"
                  : "text-text-muted group-hover:text-text-main hover:bg-muted"
              )}
            >
              <span className="truncate">{item.label}</span>
              {selected.includes(item.id) && <Check className="animate-in zoom-in size-4" />}
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
        "rounded-2xl border p-3 shadow-soft transition-all active:scale-90",
        disabled 
          ? "cursor-not-allowed border-transparent bg-muted text-text-muted/20 opacity-50" 
          : "border-subtle bg-surface text-brand-500 shadow-soft hover:border-brand-500 hover:bg-brand-500 hover:text-text-inverted"
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}
