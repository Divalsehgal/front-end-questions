import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import { 
  Combine, 
  Layers, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Apple, 
  Beef, 
  Cookie,
  Variable,
  Tag
} from "lucide-react";

export const hint = "Interactive data transformation engine that groups flat structures into tiered categories";

interface Item {
  id: string;
  type: string;
  value: string;
}

const INITIAL_ITEMS: Item[] = [
  { id: "1", type: "fruits", value: "Valencia Orange" },
  { id: "2", type: "fruits", value: "Fuji Apple" },
  { id: "3", type: "vegetables", value: "Persian Cucumber" },
  { id: "4", type: "proteins", value: "Prime Rib" },
  { id: "5", type: "vegetables", value: "Roma Tomato" },
];

const TYPE_ICONS: Record<string, any> = {
  fruits: Apple,
  vegetables: Tag,
  proteins: Beef,
  others: Cookie
};

const TYPE_COLORS: Record<string, string> = {
  fruits: "text-brand-500 bg-brand-50 dark:bg-brand-500/10",
  vegetables: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  proteins: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
  others: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
};

export default function GroupByTypeChallenge() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [newType, setNewType] = useState("fruits");
  const [newValue, setNewValue] = useState("");

  const groupedData = useMemo(() => {
    return items.reduce((acc, curr) => {
      if (!acc[curr.type]) acc[curr.type] = [];
      acc[curr.type].push(curr);
      return acc;
    }, {} as Record<string, Item[]>);
  }, [items]);

  const addItem = () => {
    if (!newValue.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      type: newType,
      value: newValue.trim()
    };
    setItems(prev => [...prev, newItem]);
    setNewValue("");
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
          <Combine className="w-7 h-7 text-brand-500" />
          SCHEMA GROUPER
        </h2>
        <p className="text-sm font-medium text-gray-500">
          Reorganize flat data streams into hierarchical structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Flat List Controls */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-900 rounded-[2.5rem] border border-surface-100 dark:border-surface-800 p-6 shadow-xl space-y-6">
             <div className="space-y-4">
               <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Ingestion Engine</h4>
               <div className="space-y-3">
                 <div className="flex gap-2">
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="bg-surface-50 dark:bg-surface-800 border-none outline-none rounded-xl px-3 py-2 text-xs font-bold uppercase text-gray-500 cursor-pointer"
                    >
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Veggies</option>
                      <option value="proteins">Proteins</option>
                      <option value="others">Others</option>
                    </select>
                    <input 
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Item name..."
                      className="flex-1 bg-surface-50 dark:bg-surface-800 border-none outline-none rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20"
                    />
                 </div>
                 <button 
                  onClick={addItem}
                  className="w-full py-3 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
                 >
                   <Plus className="w-4 h-4" />
                   Add Entry
                 </button>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Flat Records ({items.length})</h4>
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {items.map(item => (
                   <div key={item.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl group animate-in slide-in-from-left-2 transition-all">
                     <div className="flex items-center gap-3">
                       <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter", TYPE_COLORS[item.type] || TYPE_COLORS.others)}>
                         {item.type}
                       </span>
                       <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.value}</span>
                     </div>
                     <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Grouped Visualization */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-4">
             <Layers className="w-4 h-4 text-brand-500" />
             Hierarchical Output
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {Object.entries(groupedData).map(([type, records], idx) => {
               const Icon = TYPE_ICONS[type] || TYPE_ICONS.others;
               return (
                 <div 
                   key={type} 
                   className="bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500"
                   style={{ animationDelay: `${idx * 100}ms` }}
                 >
                   <div className={cn("p-6 flex items-center justify-between border-b border-surface-50 dark:border-surface-800", TYPE_COLORS[type] || TYPE_COLORS.others)}>
                     <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <h3 className="text-lg font-black uppercase tracking-tighter">{type}</h3>
                     </div>
                     <span className="text-[10px] font-black underline decoration-2 underline-offset-4">{records.length} UNITS</span>
                   </div>
                   <div className="p-6 space-y-3">
                     {records.map(record => (
                       <div key={record.id} className="flex items-center gap-3 group animate-in fade-in slide-in-from-right-2 duration-300">
                         <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 group-hover:text-brand-500 transition-all" />
                         <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{record.value}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               );
             })}

             {Object.keys(groupedData).length === 0 && (
               <div className="col-span-full h-64 flex flex-col items-center justify-center p-12 text-center bg-surface-50 dark:bg-surface-900/50 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-[3rem] space-y-4">
                 <Variable className="w-12 h-12 text-surface-300" />
                 <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Dataset Empty</p>
                 <p className="text-xs text-gray-500">Ingest items to generate grouping layers.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
