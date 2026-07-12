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
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-black tracking-tight text-text-main">Base UI Tabs</h2>
        <p className="mt-2 text-text-muted">
          An accessible, headless tabs component refactored with Tailwind v4 utilities.
        </p>
      </div>

      <Tabs.Root defaultValue="html" className="flex flex-col gap-6">
        {/* Tab List */}
        <Tabs.List className="flex gap-2 self-start rounded-2xl border border-border-subtle bg-muted p-1.5">
          {defaultItems.map((item) => (
            <Tabs.Tab 
              key={item.value} 
              value={item.value}
              className={cn(
                "cursor-pointer rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 outline-none",
                "text-text-muted hover:text-text-main",
                "data-[selected]:border data-[selected]:border-border-subtle data-[selected]:bg-surface data-[selected]:text-brand-500 data-[selected]:shadow-hard data-[selected]:shadow-brand-500/10",
                "focus-visible:ring-2 focus-visible:ring-brand-500/50"
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
              "rounded-3xl border border-border-subtle bg-surface p-8 shadow-soft",
              "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-spring",
              "focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            )}
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="h-8 w-2 shrink-0 rounded-full bg-brand-500" />
              <h3 className="text-xl font-bold tracking-widest text-text-main uppercase">{item.label} Overview</h3>
            </div>
            <p className="text-lg leading-relaxed text-text-main">
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
