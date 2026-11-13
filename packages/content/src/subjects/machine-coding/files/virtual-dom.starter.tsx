import { useState } from 'react';

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

// Write: function virtualToReal(node: VNode): Node

export default function VirtualDom() {
  // your code
  return <div className="p-6">Start building here</div>;
}
