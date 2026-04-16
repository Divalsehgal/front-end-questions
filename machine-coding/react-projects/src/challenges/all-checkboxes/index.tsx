import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { Check, CheckSquare, Square, ListTodo, Shuffle } from "lucide-react";
import { Checkbox } from "@base-ui/react/checkbox";

export const hint = "Advanced checkbox list with 'Select All' and indeterminate state logic";

interface Item {
  id: number;
  label: string;
  checked: boolean;
}

const INITIAL_ITEMS: Item[] = [
  { id: 1, label: "Interactive Components", checked: false },
  { id: 2, label: "Tailwind v4 Styling", checked: true },
  { id: 3, label: "Base UI Primitives", checked: false },
  { id: 4, label: "TypeScript Safety", checked: false },
  { id: 5, label: "Performance Optimization", checked: false },
];

export default function AllCheckboxes() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  const allChecked = useMemo(() => items.every((i) => i.checked), [items]);
  const someChecked = useMemo(() => items.some((i) => i.checked) && !allChecked, [items]);

  const toggleAll = () => {
    const nextState = !allChecked;
    setItems((prev) => prev.map((item) => ({ ...item, checked: nextState })));
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight">
          <ListTodo className="w-7 h-7 text-brand-500" />
          TASK SELECTION
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Manage multiple items with collective controls.
        </p>
      </div>

      <div className="bg-surface rounded-3xl border border-subtle shadow-hard overflow-hidden">
        {/* Header / Select All */}
        <div className="p-4 bg-muted border-b border-subtle">
          <label className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-surface-800 transition-all cursor-pointer group">
            <Checkbox.Root
              checked={allChecked ? true : someChecked ? "indeterminate" : false}
              onCheckedChange={toggleAll}
              className={cn(
                "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0",
                allChecked || someChecked
                  ? "bg-brand-500 border-brand-500 text-text-inverted"
                  : "bg-transparent border-strong group-hover:border-brand-500"
              )}
            >
              <Checkbox.Indicator>
                {allChecked ? <Check className="w-4 h-4" strokeWidth={3} /> : <div className="w-2.5 h-0.5 bg-text-inverted rounded-full" />}
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="font-bold text-text-main uppercase tracking-wider text-xs">
              Select All Components
            </span>
          </label>
        </div>

        {/* List Items */}
        <div className="p-4 space-y-1">
          {items.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group mb-1",
                item.checked 
                  ? "bg-brand-500/10" 
                  : "hover:bg-muted"
              )}
            >
              <Checkbox.Root
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0",
                  item.checked
                    ? "bg-brand-500 border-brand-500 text-text-inverted shadow-soft shadow-brand-500/20"
                    : "bg-transparent border-subtle group-hover:border-brand-500"
                )}
              >
                <Checkbox.Indicator>
                  <Check className="w-4 h-4" strokeWidth={3} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className={cn(
                "text-sm font-medium transition-colors",
                item.checked ? "text-text-main" : "text-text-muted"
              )}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 p-4 bg-muted rounded-2xl border border-subtle space-y-1">
          <p className="text-tiny font-bold text-text-muted uppercase tracking-widest">Selected</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-text-main">
              {items.filter(i => i.checked).length}
            </span>
            <span className="text-xs font-bold text-text-muted">/ {items.length}</span>
          </div>
        </div>
        <button 
          onClick={() => setItems(items.map(i => ({ ...i, checked: Math.random() > 0.5 })))}
          className="flex items-center justify-center p-4 bg-surface border border-subtle rounded-2xl hover:bg-muted transition-all shadow-soft active:scale-95 group"
        >
          <Shuffle className="w-6 h-6 text-brand-500 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}
