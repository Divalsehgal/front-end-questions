import { Tabs } from "@base-ui/react/tabs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const ITEMS = [
  {
    label: "HTML",
    value: "html",
    content: "HTML describes the structure of a page: headings, paragraphs, links, forms and the other elements the browser renders.",
  },
  {
    label: "CSS",
    value: "css",
    content: "CSS controls how those elements look: layout, spacing, colour, typography and how the page adapts to different screens.",
  },
  {
    label: "JavaScript",
    value: "js",
    content: "JavaScript adds behaviour: it responds to user input, updates the page and talks to servers without a full reload.",
  },
];

// Base UI wires up roles, aria-selected, aria-controls/aria-labelledby and
// arrow-key navigation. Panels unmount when hidden by default (lazy, cheaper,
// but local state is lost); pass `keepMounted` to keep them in the DOM and
// preserve state such as scroll position or form input.
export default function TabsDemo() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-main">Tabs</h2>
        <p className="mt-1 text-sm text-text-muted">Built on Base UI Tabs</p>
      </div>

      <Tabs.Root defaultValue="html" className="flex flex-col gap-4">
        <Tabs.List className="flex gap-1 self-start rounded-xl border border-border-subtle bg-muted p-1">
          {ITEMS.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              className={cn(
                "cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-colors outline-none",
                "text-text-muted hover:text-text-main",
                "aria-selected:bg-surface aria-selected:text-brand-500 aria-selected:shadow-soft",
                "focus-visible:ring-2 focus-visible:ring-brand-500/50"
              )}
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {ITEMS.map((item) => (
          <Tabs.Panel
            key={item.value}
            value={item.value}
            className="rounded-2xl border border-border-subtle bg-surface p-6 focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:outline-none"
          >
            <h3 className="mb-2 text-lg font-bold text-text-main">{item.label}</h3>
            <p className="leading-relaxed text-text-main">{item.content}</p>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
