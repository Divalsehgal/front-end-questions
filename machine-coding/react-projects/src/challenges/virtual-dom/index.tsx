import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { 
  Code2, 
  Dumbbell, 
  Layout, 
  Box, 
  Terminal, 
  Sparkles,
  ChevronRight,
  Database
} from "lucide-react";

export const hint = "Recursive rendering engine that maps JSON structures to real DOM nodes";

// --- Logic Layer ---

function virtualToReal(node: any): Node {
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.type);

  if (node.props) {
    Object.entries(node.props).forEach(([key, value]) => {
      if (key === "children") {
        if (Array.isArray(value)) {
          value.forEach((child) => element.appendChild(virtualToReal(child)));
        } else {
          element.appendChild(virtualToReal(value));
        }
      } else if (key === "className") {
        element.setAttribute("class", value as string);
      } else {
        element.setAttribute(key, value as string);
      }
    });
  }

  return element;
}

const SAMPLE_DOM = {
  type: "div",
  props: {
    className: "p-8 bg-brand-500 text-text-inverted rounded-3xl space-y-4 shadow-hard",
    children: [
      { type: "h3", props: { className: "text-2xl font-black tracking-tighter uppercase", children: "Neural Kernel" } },
      { type: "p", props: { className: "text-text-inverted/70 text-sm font-medium", children: "Rendering engine initialized. All nodes verified." } },
      { 
        type: "button", 
        props: { 
          className: "px-6 py-2.5 bg-surface text-brand-500 rounded-xl font-black text-tiny uppercase tracking-widest hover:scale-105 transition-transform shadow-soft", 
          children: "Sync Core" 
        } 
      }
    ]
  }
};

export default function VirtualDom() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const realNode = virtualToReal(SAMPLE_DOM);
      containerRef.current.appendChild(realNode);
    }
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-500 text-tiny font-black uppercase tracking-widest rounded-full">Recursive Engine</span>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase shrink-0">
            Node <span className="text-brand-500">Serializer</span>
          </h1>
          <p className="text-sm text-text-muted font-medium">Complexity: Recursion & DOM API Mastery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center text-text-muted">
                 <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Virtual Structure (Input)</h3>
           </div>
           <pre className="p-6 bg-muted rounded-2xl border border-subtle overflow-auto max-h-[500px] text-tiny text-brand-500 font-mono">
              {JSON.stringify(SAMPLE_DOM, null, 2)}
           </pre>
        </div>

        <div className="bg-surface border border-subtle rounded-3xl p-8 shadow-hard space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center">
                 <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted">Physical Render (Output)</h3>
           </div>
           <div 
             ref={containerRef}
             className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-subtle rounded-3xl p-8"
           />
        </div>
      </div>
    </div>
  );
}
