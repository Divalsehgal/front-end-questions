import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import { 
  Box, 
  Code2, 
  Cpu, 
  Zap, 
  Play, 
  Terminal, 
  Info,
  Layers,
  Container
} from "lucide-react";

export const hint = "Recursive rendering engine that transforms a JSON virtual tree into a synchronized physical DOM tree";

// --- The Engine Logic (Core Challenge) ---

function createPhysicalNode(node: any): Node | null {
  // 1. Handle string/number (text nodes)
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
  }

  // 2. Handle null/undefined
  if (!node) return null;

  // 3. Handle Object (Element nodes or Fragments)
  const { type, props } = node;
  const { children, ...attributes } = props || {};

  // Create element (standard React-like object structure)
  const element = type ? document.createElement(type) : document.createDocumentFragment();

  // Apply attributes (if not a fragment)
  if (element instanceof HTMLElement) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.setAttribute("class", String(value));
      } else if (key === "style" && typeof value === "object") {
        Object.entries(value as object).forEach(([sKey, sVal]) => {
          (element.style as any)[sKey] = sVal;
        });
      } else {
        element.setAttribute(key, String(value));
      }
    });
  }

  // Handle Children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        const childNode = createPhysicalNode(child);
        if (childNode) element.appendChild(childNode);
      });
    } else if (typeof children === "object") {
       // Support object-based indexed children from the user's sample
       Object.values(children).forEach(child => {
          const childNode = createPhysicalNode(child);
          if (childNode) element.appendChild(childNode);
       });
    } else {
      const childNode = createPhysicalNode(children);
      if (childNode) element.appendChild(childNode);
    }
  }

  return element;
}

// --- Application UI ---

const DEFAULT_VDOM = {
  type: "div",
  props: {
    className: "p-8 bg-brand-500 rounded-[2rem] text-white space-y-4 shadow-xl",
    children: [
      {
        type: "h1",
        props: {
          className: "text-2xl font-black uppercase tracking-tighter",
          children: "Custom Renderer Active"
        }
      },
      {
        type: "p",
        props: {
          className: "text-sm font-medium opacity-90",
          children: "This entire block was rendered bypassing React's native reconciliation, using a custom recursive createPhysicalNode engine."
        }
      },
      {
        type: "div",
        props: {
          className: "flex gap-2",
          children: [
            {
               type: "span",
               props: { className: "px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold", children: "DOM NODES" }
            },
            {
               type: "span",
               props: { className: "px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold", children: "RECONCILED" }
            }
          ]
        }
      }
    ]
  }
};

export default function VirtualDomChallenge() {
  const [vdomJson, setVdomJson] = useState(JSON.stringify(DEFAULT_VDOM, null, 2));
  const [error, setError] = useState<string | null>(null);
  const renderRootRef = useRef<HTMLDivElement>(null);

  const runRenderer = () => {
    try {
      const vNode = JSON.parse(vdomJson);
      if (!renderRootRef.current) return;

      // Clear existing DOM
      renderRootRef.current.innerHTML = "";
      
      // Generate new Physical DOM from Virtual Node
      const physicalNodes = createPhysicalNode(vNode);
      if (physicalNodes) {
        renderRootRef.current.appendChild(physicalNodes);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    runRenderer();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
            <Cpu className="w-7 h-7 text-brand-500" />
            CORE RENDERER
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Simulating low-level DOM reconciliation and tree synchronization.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 rounded-2xl text-brand-500 font-bold text-xs uppercase tracking-widest">
           <Zap className="w-4 h-4 animate-pulse" />
           Engine Stable
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* VDOM Definition Editor */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Code2 className="w-3 h-3" />
              Virtual Node (JSON)
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-500/20">
                <Terminal className="w-3 h-3" />
                PARSE ERROR
              </div>
            )}
          </div>
          
          <div className="flex-1 min-h-[400px] relative group">
            <textarea
              value={vdomJson}
              onChange={(e) => setVdomJson(e.target.value)}
              className={cn(
                "w-full h-full p-6 bg-surface-950 text-brand-300 font-mono text-xs rounded-[2.5rem] border-4 outline-none transition-all resize-none overflow-auto custom-scrollbar",
                error ? "border-red-500/30" : "border-surface-200 dark:border-surface-800 focus:border-brand-500/30 group-hover:border-surface-300 dark:group-hover:border-surface-700"
              )}
              spellCheck={false}
            />
            <button 
              onClick={runRenderer}
              className="absolute bottom-6 right-6 p-4 bg-brand-500 text-white rounded-2xl shadow-2xl hover:bg-brand-600 active:scale-95 transition-all group/btn"
            >
              <Play className="w-6 h-6 fill-current group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Physical Rendering Target */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">
             <Container className="w-3 h-3" />
             Physical Target (Physical DOM)
          </div>
          
          <div className="flex-1 min-h-[400px] bg-white dark:bg-surface-900 border-2 border-surface-100 dark:border-surface-800 rounded-[2.5rem] p-8 shadow-inner overflow-auto relative">
             <div ref={renderRootRef} className="animate-in fade-in zoom-in-95 duration-700" />
             
             {/* Engine Legend Overlay */}
             <div className="absolute bottom-6 right-6 pointer-events-none">
                <div className="bg-surface-50/80 dark:bg-surface-800/80 backdrop-blur-md border border-surface-200 dark:border-surface-700 p-4 rounded-2xl shadow-lg space-y-2 max-w-[200px]">
                   <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase">
                      <Info className="w-3 h-3" />
                      Reconciliation Logic
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Text Nodes</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Prop Mapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Recursion Depth</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="p-4 bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-2xl text-center space-y-1">
                <Layers className="w-4 h-4 mx-auto text-brand-500 opacity-60" />
                <p className="text-[8px] font-black text-gray-400 uppercase">Tree Depth</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">DYNAMIC</p>
             </div>
             <div className="p-4 bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-2xl text-center space-y-1 text-emerald-500">
                <Box className="w-4 h-4 mx-auto opacity-60" />
                <p className="text-[8px] font-black text-gray-400 uppercase">Attribute Sync</p>
                <p className="text-sm font-black">ACTIVE</p>
             </div>
             <div className="p-4 bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 rounded-2xl text-center space-y-1 text-amber-500">
                <Zap className="w-4 h-4 mx-auto opacity-60" />
                <p className="text-[8px] font-black text-gray-400 uppercase">Latency</p>
                <p className="text-sm font-black">&lt;1ms</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
