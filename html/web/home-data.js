const knowledgeItems = [
  { title: "Semantic Tags", code: "&lt;main&gt;\n  &lt;article&gt;...&lt;/article&gt;\n&lt;/main&gt;", text: "Using explicit sectioning tags removes the need for abstract roles and provides native keyboard support out of the box." },
  { title: "ARIA Contracts", code: "aria-controls='id'\naria-labelledby='id'", text: "ARIA binds separate elements together, proving context to screen readers where visual context fails." },
  { title: "Visual Fakers", code: "transform: skew(20deg);\nclip-path: polygon(...);", text: "CSS manipulation using transforms or masks generates complex geometry without bloating the DOM." },
  { title: "DOM vs BOM", code: "// DOM\ndocument.getElementById('app');\n\n// BOM\nwindow.location.href;", text: "<strong>DOM</strong> translates raw HTML into an object tree (<code>document</code>). <strong>BOM</strong> is the interface for the Browser Window (<code>window.location</code>, history, navigator)." },
  { title: "CSS: rem vs em Units", code: "h1 { font-size: 2rem; } /* 32px */\n.parent { font-size: 1.5em; /* 24px */ }", text: "<code>rem</code> relates to the root HTML font-size (usually 16px). <code>em</code> relates to the immediate parent's font-size, which can cause compounding sizing issues." },
  { title: "CSS: flex vs inline-flex", code: ".container {\n  display: flex;\n}\n.inline-container {\n  display: inline-flex;\n}", text: "<code>display: flex</code> creates a block-level container (full width). <code>display: inline-flex</code> creates an inline-level container (content width)." }
];

export default knowledgeItems;
