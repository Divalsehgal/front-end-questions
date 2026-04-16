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
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-warning-500/10 text-warning-500 text-tiny font-black uppercase tracking-widest rounded-full">Utility Module</span>
            <span className="w-1.5 h-1.5 bg-warning-500 rounded-full animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase shrink-0">
            Schema <span className="text-warning-500">Grouper</span>
          </h1>
          <p className="text-sm text-text-muted font-medium">Complexity: Data Partitioning & Type Safety.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 items-start">
        {/* Source Data List */}
        <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center text-text-muted">
                 <Database className="w-5 h-5" />
              </div>
              <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Input Stream</h3>
           </div>

           <div className="space-y-2 max-h-[600px] overflow-auto custom-scrollbar pr-2">
              {RAW_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-subtle group hover:border-warning-500/30 transition-all">
                   <span className="text-tiny font-black text-text-muted w-4 opacity-30">{idx + 1}</span>
                   <code className="text-tiny text-text-muted truncate flex-1">
                      {JSON.stringify(item) || String(item)}
                   </code>
                   <ChevronRight className="w-3 h-3 text-text-muted/30 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
           </div>
        </div>

        {/* Grouped Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[123.45px]">
           {Object.entries(groupedData).map(([type, items], idx) => (
             <div 
               key={type} 
               className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard flex flex-col space-y-6 hover:scale-[1.02] transition-all duration-500"
               style={{ animationDelay: `${idx * 100}ms` }}
             >
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-tiny font-black text-warning-500 uppercase tracking-widest mb-1">{type}</span>
                      <h4 className="text-xl font-black text-text-main capitalize tracking-tighter shrink-0">{type}s</h4>
                   </div>
                   <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-text-muted opacity-50">
                      {type === 'string' && <Quote className="w-5 h-5" />}
                      {type === 'number' && <Hash className="w-5 h-5" />}
                      {type === 'boolean' && <ToggleLeft className="w-5 h-5" />}
                      {type === 'object' && <Box className="w-5 h-5" />}
                      {type === 'array' && <Binary className="w-5 h-5" />}
                      {!['string', 'number', 'boolean', 'object', 'array'].includes(type) && <Puzzle className="w-5 h-5" />}
                   </div>
                </div>

                <div className="flex-1 space-y-3">
                   {items.map((item, i) => (
                     <div key={i} className="p-3 bg-muted rounded-xl border border-subtle">
                        <code className="text-tiny text-text-muted break-all block">
                           {JSON.stringify(item) || String(item)}
                        </code>
                     </div>
                   ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-subtle">
                   <span className="text-tiny font-black text-text-muted uppercase tracking-widest">Count</span>
                   <span className="text-xs font-black text-warning-500">{items.length}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
