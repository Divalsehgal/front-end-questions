const htmlConceptsData = [
  {
    title: "<cite>",
    description: "Used to define the title of a creative work within a block of text.",
    code: "<p>My favorite book is <cite>The Hitchhiker's Guide to the Galaxy</cite>.</p>"
  },
  {
    title: "<bdi> (Bidirectional Isolation)",
    description: "Used to isolate a span of text that might be formatted in a different direction from its surrounding text.",
    code: "<ul>\n  <li>User <bdi>John</bdi>: 5 points</li>\n  <li>User <bdi>إبراهيم</bdi>: 8 points</li>\n</ul>"
  },
  {
    title: "<bdo> (Bidirectional Override)",
    description: "Defines the direction of text display, either right-to-left (rtl) or left-to-right (ltr).",
    code: "<bdo dir=\"rtl\">This text will go right to left.</bdo>"
  },
  {
    title: "<track>",
    description: "Used in conjunction with the <audio> and <video> elements to specify external text track files.",
    code: "<video src=\"video.mp4\">\n  <!-- Adds English subtitles -->\n  <track kind=\"subtitles\" src=\"subtitles_en.vtt\" srclang=\"en\" label=\"English\">\n</video>"
  },
  {
    title: "<dfn> and <dl>",
    description: "<dfn> defines the defining instance of a term. <dl> defines a description list.",
    code: "<!-- Example of dfn -->\n<p>A <dfn id=\"html-def\">HTML</dfn> is the standard markup language.</p>\n\n<!-- Example of dl -->\n<dl>\n  <dt>Coffee</dt>\n  <dd>Black hot drink</dd>\n</dl>"
  },
  {
    title: "rem vs em Units",
    description: "rem is based purely on the font size of the root element (<html>). em is based on the font size of the immediate parent element, which can cause compounding sizing issues.",
    code: "/* root: 16px */\n.container { font-size: 2rem; } /* 32px */"
  },
  {
    title: "display: flex; vs display: inline-flex;",
    description: "flex creates a block-level flex container. inline-flex creates an inline-level flex container, sitting side-by-side with other inline elements.",
    code: ".block-box {\n  display: flex;\n}\n.inline-box {\n  display: inline-flex;\n}"
  },
  {
    title: "Document Setup & Accessibility",
    description: "lang sets the language, Meta Charset covers character encoding standards, Viewport ensures responsive design, and Canonical Links specify preferred URLs.",
    code: "<html lang=\"en\">\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<link rel=\"canonical\" href=\"...\">"
  },
  {
    title: "Screen-Reader Only Elements (sr-only)",
    description: "Visual hiding without removing the element for screen readers. Never use display: none for screen-reader text.",
    code: ".sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}"
  },
  {
    title: "Forms & Validation",
    description: "<fieldset> and <legend> group related controls. Labels can be implicitly linked by nesting. Built-in behaviors include autocomplete, spellcheck, pattern, min, and max.",
    code: "<fieldset>\n  <legend>User details</legend>\n  <label>Name: <input autocomplete=\"on\" spellcheck=\"false\"></label>\n</fieldset>"
  },
  {
    title: "DOM vs BOM",
    description: "The DOM translates raw HTML into an object tree (document). The BOM is the interface for the Browser Window itself (window.location, history, navigator).",
    code: "// DOM Manipulations\ndocument.getElementById('app');\n\n// BOM Actions\nwindow.alert('Hello!');\nconsole.log(window.location.href);"
  },
  {
    title: "Void Elements",
    description: "Elements in HTML that cannot have any child nodes, nesting, or inner text, and do not require a closing tag.",
    code: "<!-- Correct usage -->\n<img src=\"cat.jpg\" alt=\"A cat\" />\n<input type=\"text\" value=\"Default text\" />\n<br />"
  },
  {
    title: "Semantic HTML Elements",
    description: "Use header tags, <section>, <article>, and <figure> to encapsulate parts of the document for SEO and accessibility.",
    code: "<figure>\n  <img src=\"image.jpg\" alt=\"Description\" />\n  <figcaption>Caption</figcaption>\n</figure>"
  },
  {
    title: "Select Dropdowns",
    description: "Use an empty value=\"\" for the first option as a placeholder. Add disabled hidden selected to make it a non-selectable prompt.",
    code: "<select required>\n  <option value=\"\" disabled selected hidden>(select one)</option>\n  <option value=\"1\">Option 1</option>\n</select>"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = htmlConceptsData;
}
