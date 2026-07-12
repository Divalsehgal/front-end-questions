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
    <div className="mx-auto min-h-screen max-w-[1400px] space-y-8 p-4 md:p-8">
      <div className="border-subtle flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-tiny rounded-full bg-brand-500/10 px-3 py-1 font-black tracking-widest text-brand-500 uppercase">Recursive Engine</span>
            <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />
          </div>
          <h1 className="shrink-0 text-4xl font-black tracking-tighter text-text-main uppercase md:text-5xl">
            Node <span className="text-brand-500">Serializer</span>
          </h1>
          <p className="text-sm font-medium text-text-muted">Complexity: Recursion & DOM API Mastery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
        <div className="border-subtle space-y-6 rounded-3xl border bg-surface p-8 shadow-hard">
           <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-muted text-text-muted">
                 <Terminal className="size-5" />
              </div>
              <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Virtual Structure (Input)</h3>
           </div>
           <pre className="border-subtle text-tiny max-h-[500px] overflow-auto rounded-2xl border bg-muted p-6 font-mono text-brand-500">
              {JSON.stringify(SAMPLE_DOM, null, 2)}
           </pre>
        </div>

        <div className="border-subtle space-y-6 rounded-3xl border bg-surface p-8 shadow-hard">
           <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
                 <Layout className="size-5" />
              </div>
              <h3 className="text-tiny font-black tracking-widest text-text-muted uppercase">Physical Render (Output)</h3>
           </div>
           <div 
             ref={containerRef}
             className="border-subtle flex min-h-[300px] items-center justify-center rounded-3xl border-2 border-dashed p-8"
           />
        </div>
      </div>
    </div>
  );
}
