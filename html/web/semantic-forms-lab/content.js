const formKnowledgeData = [
  {
    title: "The Problem: Unlinked Labels",
    cause: "Wrapping text next to an input without a <code>for</code> / <code>id</code> mapping.",
    fix: "Use <code>for=\"some-id\"</code> on the label. This expands the clickable area (try clicking the word \"Username\" below) and tells screen readers exactly what the input is for.",
    code: `<!-- Bad -->\n<span>Username</span><input>\n\n<!-- Good -->\n<label for="user">Username</label>\n<input id="user">`
  },
  {
    title: "Form Validation (Regex)",
    cause: "Server-only validation wastes time and frustrates users.",
    fix: "Use HTML5 <code>pattern</code> attributes and pseudo-classes like <code>:invalid</code> to give instant visual feedback before submission.",
    code: `<input type="password" \n       pattern=".{8,}" required>`
  },
  {
    title: "Grouping with Fieldset",
    cause: "A generic <code>&lt;div&gt;</code> isn't enough for grouping radio buttons.",
    fix: "Screen readers need <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> to announce the group's overall context.",
    code: `<fieldset>\n  <legend>Account Type</legend>\n  ... radios ...\n</fieldset>`
  },
  {
    title: "Important Semantic Tags",
    text: "<code>&lt;cite&gt;</code> for titles of creative works.<br><code>&lt;bdi&gt;</code> and <code>&lt;bdo&gt;</code> for bidirectional text.<br><code>&lt;track&gt;</code> for subtitles in media.<br><code>&lt;dfn&gt;</code> and <code>&lt;dl&gt;</code> for terms and definitions.",
    code: `<!-- Example of dl -->\n<dl>\n  <dt>Coffee</dt>\n  <dd>Black drink</dd>\n</dl>`
  },
  {
    title: "Select Dropdowns & Placeholders",
    text: "Use an empty <code>value=\"\"</code> for the first option. For a non-selectable prompt, use <code>disabled hidden selected</code>. In React, use a controlled value on the <code>&lt;select&gt;</code>.",
    code: `<select required>\n  <option value="" disabled selected hidden>(select)</option>\n  <option value="1">Option 1</option>\n</select>`
  },
  {
    title: "Void Elements",
    text: "Void elements cannot have child nodes or inner text. They do not require a closing tag in HTML5.",
    code: `<!-- Valid HTML5 -->\n<img src="cat.jpg" alt="A cat" />\n<input type="text" />\n<br>\n<hr>\n<meta charset="UTF-8">`
  },
  {
    title: "Images with Captions",
    text: "When including images with captions, employ the <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code> tags. This aids in captioning and ensures semantic correctness.",
    code: `<figure>\n  <img src="image.jpg" alt="Desc" />\n  <figcaption>Caption</figcaption>\n</figure>`
  },
  {
    title: "Sections and Articles",
    text: "Instead of generic divs, utilize <code>&lt;section&gt;</code> to encapsulate distinct parts of the document. To create subsections, use <code>&lt;article&gt;</code>.",
    code: `<section>\n  <h2>Section Title</h2>\n  <article>\n    <p>Content</p>\n  </article>\n</section>`
  },
  {
    title: "Document Setup & Meta",
    text: "<code>&lt;meta charset=\"UTF-8\"&gt;</code> specifies universal encoding. <code>viewport</code> is essential for responsive design. Canonical Links tell search engines preferred URLs.",
    code: `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<link rel="canonical" href="...">`
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('knowledge-grid');
  formKnowledgeData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'k-card';
    
    let descHtml = '';
    if (item.cause || item.fix) {
      descHtml = `<p>${item.cause ? `<strong>The Cause:</strong> ${item.cause}<br>` : ''}${item.fix ? `<strong>The Fix:</strong> ${item.fix}` : ''}</p>`;
    } else if (item.text) {
      descHtml = `<p>${item.text}</p>`;
    }

    card.innerHTML = `
      <h3>${item.title}</h3>
      ${descHtml}
      <div class="code-block">
        <pre><code>${item.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        <button class="copy-btn">Copy</button>
      </div>
    `;
    container.appendChild(card);
  });
});
