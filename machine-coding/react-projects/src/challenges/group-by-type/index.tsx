import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { 
  Puzzle, 
  Layout, 
  Box, 
  Binary, 
  Hash, 
  Quote, 
  ToggleLeft,
  ChevronRight,
  Database
} from "lucide-react";

export const hint = "Dynamic data grouping engine using partitioned schemas";

const RAW_DATA = [
  "Antigravity",
  101,
  { name: "Agent", tier: "Elite" },
  [1, 2, 3],
  "FAANG",
  42,
  null,
  { id: 1 },
  true,
  [10, 20],
  undefined,
  () => console.log("Logic")
];

// --- Logic Layer ---
function groupByType(collection: any[]): Record<string, any[]> {
  return collection.reduce((acc, item) => {
    let type: string = typeof item;
    if (item === null) type = "null";
    else if (Array.isArray(item)) type = "array";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

export default function GroupByType() {
  const groupedData = groupByType(RAW_DATA);

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] space-y-8 p-4 md:p-8">
      <div className="border-subtle flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="bg-warning-500/10 text-warning-500 text-tiny rounded-full px-3 py-1 font-black tracking-widest uppercase">Utility Module</span>
            <span className="bg-warning-500 size-1.5 animate-bounce rounded-full" />
          </div>
          <h1 className="shrink-0 text-4xl font-black tracking-tighter text-text-main uppercase md:text-5xl">
            Schema <span className="text-warning-500">Grouper</span>
          </h1>
          <p className="text-sm font-medium text-text-muted">Complexity: Data Partitioning & Type Safety.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[400px_1fr]">
        {/* Source Data List */}
        <div className="border-subtle space-y-6 rounded-3xl border bg-surface p-8 shadow-hard">
           <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-text-muted">
                 <Database className="size-5" />
              </div>
              <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Input Stream</h3>
           </div>

           <div className="custom-scrollbar max-h-[600px] space-y-2 overflow-auto pr-2">
              {RAW_DATA.map((item, idx) => (
                <div key={idx} className="border-subtle group hover:border-warning-500/30 flex items-center gap-3 rounded-xl border bg-muted p-3 transition-all">
                   <span className="text-tiny w-4 font-black text-text-muted opacity-30">{idx + 1}</span>
                   <code className="text-tiny flex-1 truncate text-text-muted">
                      {JSON.stringify(item) || String(item)}
                   </code>
                   <ChevronRight className="size-3 text-text-muted/30 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
           </div>
        </div>

        {/* Grouped Visualization */}
        <div className="grid w-[123.45px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
           {Object.entries(groupedData).map(([type, items], idx) => (
             <div 
               key={type} 
               className="border-subtle flex flex-col space-y-6 rounded-3xl border bg-surface p-8 shadow-hard transition-all duration-500 hover:scale-[1.02]"
               style={{ animationDelay: `${idx * 100}ms` }}
             >
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-tiny text-warning-500 mb-1 font-black tracking-widest uppercase">{type}</span>
                      <h4 className="shrink-0 text-xl font-black tracking-tighter text-text-main capitalize">{type}s</h4>
                   </div>
                   <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-text-muted opacity-50">
                      {type === 'string' && <Quote className="size-5" />}
                      {type === 'number' && <Hash className="size-5" />}
                      {type === 'boolean' && <ToggleLeft className="size-5" />}
                      {type === 'object' && <Box className="size-5" />}
                      {type === 'array' && <Binary className="size-5" />}
                      {!['string', 'number', 'boolean', 'object', 'array'].includes(type) && <Puzzle className="size-5" />}
                   </div>
                </div>

                <div className="flex-1 space-y-3">
                   {items.map((item, i) => (
                     <div key={i} className="border-subtle rounded-xl border bg-muted p-3">
                        <code className="text-tiny block break-all text-text-muted">
                           {JSON.stringify(item) || String(item)}
                        </code>
                     </div>
                   ))}
                </div>

                <div className="border-subtle flex items-center gap-2 border-t pt-4">
                   <span className="text-tiny font-black tracking-widest text-text-muted uppercase">Count</span>
                   <span className="text-warning-500 text-xs font-black">{items.length}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
