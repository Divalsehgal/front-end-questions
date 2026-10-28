import { useEffect, useRef } from "react";

type VNode = string | number | { type: string; props?: Record<string, string>; children?: VNode[] };

const SAMPLE_DOM: VNode = {
  type: "div",
  props: { className: "space-y-3 rounded-2xl bg-brand-500 p-6 text-text-inverted" },
  children: [
    { type: "h3", props: { className: "text-xl font-bold" }, children: ["Hello"] },
    { type: "p", props: { className: "text-sm" }, children: ["Rendered from a JSON tree."] },
    {
      type: "button",
      props: { type: "button", className: "rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-brand-600" },
      children: ["Click me"],
    },
  ],
};

/** Recursively turns a virtual node into a real DOM node. */
function virtualToReal(node: VNode): Node {
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.type);

  for (const [key, value] of Object.entries(node.props ?? {})) {
    // JSX-style names map to their HTML attribute names.
    const attr = key === "className" ? "class" : key === "htmlFor" ? "for" : key;
    element.setAttribute(attr, String(value));
  }

  for (const child of node.children ?? []) {
    element.appendChild(virtualToReal(child));
  }

  return element;
}

export default function VirtualDom() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Clear first so a re-run (StrictMode, or new input) doesn't append a second copy.
    container.replaceChildren(virtualToReal(SAMPLE_DOM));
    return () => container.replaceChildren();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-text-main">Virtual DOM → real DOM</h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-text-muted">Input</h2>
          <pre className="max-h-[480px] overflow-auto rounded-xl border border-border-subtle bg-muted p-4 font-mono text-xs text-text-main">
            {JSON.stringify(SAMPLE_DOM, null, 2)}
          </pre>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-text-muted">Output</h2>
          <div ref={containerRef} className="rounded-xl border-2 border-dashed border-border-subtle p-6" />
        </section>
      </div>
    </div>
  );
}
