import React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const defaultItems = [
  { label: "HTML", value: "html", panel: "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser." },
  { label: "CSS", value: "css", panel: "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML." },
  { label: "JavaScript", value: "js", panel: "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS." }
];

const TabsDemo = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-black tracking-tight text-text-main">Base UI Tabs</h2>
        <p className="text-text-muted mt-2">
          An accessible, headless tabs component refactored with Tailwind v4 utilities.
        </p>
      </div>

      <Tabs.Root defaultValue="html" className="flex flex-col gap-6">
        {/* Tab List */}
        <Tabs.List className="flex gap-2 p-1.5 bg-surface-sunken rounded-2xl border border-border-subtle self-start">
          {defaultItems.map((item) => (
            <Tabs.Tab 
              key={item.value} 
              value={item.value}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 outline-none cursor-pointer",
                "text-text-muted hover:text-text-main",
                "data-[selected]:bg-surface data-[selected]:text-primary data-[selected]:shadow-lg data-[selected]:shadow-primary/10 data-[selected]:border data-[selected]:border-border-subtle",
                "focus-visible:ring-2 focus-visible:ring-primary/50"
              )}
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {/* Panels */}
        {defaultItems.map((item) => (
          <Tabs.Panel 
            key={item.value} 
            value={item.value}
            className={cn(
              "p-8 bg-surface rounded-3xl border border-border-subtle shadow-sm",
              "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-spring",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-2 h-8 bg-primary rounded-full shrink-0" />
              <h3 className="text-xl font-bold text-text-main uppercase tracking-widest">{item.label} Overview</h3>
            </div>
            <p className="text-text-main leading-relaxed text-lg">
              {item.panel}
            </p>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
};

export default TabsDemo;
export const hint = "Tabs component with keyboard navigation using Base UI";
