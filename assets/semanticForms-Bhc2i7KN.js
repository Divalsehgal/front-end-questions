import"./styles-CNw9mgIE.js";const d=[{title:"The Problem: Unlinked Labels",cause:"Wrapping text next to an input without a <code>for</code> / <code>id</code> mapping.",fix:'Use <code>for="some-id"</code> on the label. This expands the clickable area (try clicking the word "Username" below) and tells screen readers exactly what the input is for.',code:`<!-- Bad -->
<span>Username</span><input>

<!-- Good -->
<label for="user">Username</label>
<input id="user">`},{title:"Form Validation (Regex)",cause:"Server-only validation wastes time and frustrates users.",fix:"Use HTML5 <code>pattern</code> attributes and pseudo-classes like <code>:invalid</code> to give instant visual feedback before submission.",code:`<input type="password" 
       pattern=".{8,}" required>`},{title:"Grouping with Fieldset",cause:"A generic <code>&lt;div&gt;</code> isn't enough for grouping radio buttons.",fix:"Screen readers need <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> to announce the group's overall context.",code:`<fieldset>
  <legend>Account Type</legend>
  ... radios ...
</fieldset>`},{title:"Important Semantic Tags",text:"<code>&lt;cite&gt;</code> for titles of creative works.<br><code>&lt;bdi&gt;</code> and <code>&lt;bdo&gt;</code> for bidirectional text.<br><code>&lt;track&gt;</code> for subtitles in media.<br><code>&lt;dfn&gt;</code> and <code>&lt;dl&gt;</code> for terms and definitions.",code:`<!-- Example of dl -->
<dl>
  <dt>Coffee</dt>
  <dd>Black drink</dd>
</dl>`},{title:"Select Dropdowns & Placeholders",text:'Use an empty <code>value=""</code> for the first option. For a non-selectable prompt, use <code>disabled hidden selected</code>. In React, use a controlled value on the <code>&lt;select&gt;</code>.',code:`<select required>
  <option value="" disabled selected hidden>(select)</option>
  <option value="1">Option 1</option>
</select>`},{title:"Void Elements",text:"Void elements cannot have child nodes or inner text. They do not require a closing tag in HTML5.",code:`<!-- Valid HTML5 -->
<img src="cat.jpg" alt="A cat" />
<input type="text" />
<br>
<hr>
<meta charset="UTF-8">`},{title:"Images with Captions",text:"When including images with captions, employ the <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code> tags. This aids in captioning and ensures semantic correctness.",code:`<figure>
  <img src="image.jpg" alt="Desc" />
  <figcaption>Caption</figcaption>
</figure>`},{title:"Sections and Articles",text:"Instead of generic divs, utilize <code>&lt;section&gt;</code> to encapsulate distinct parts of the document. To create subsections, use <code>&lt;article&gt;</code>.",code:`<section>
  <h2>Section Title</h2>
  <article>
    <p>Content</p>
  </article>
</section>`},{title:"Document Setup & Meta",text:'<code>&lt;meta charset="UTF-8"&gt;</code> specifies universal encoding. <code>viewport</code> is essential for responsive design. Canonical Links tell search engines preferred URLs.',code:`<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="...">`}];document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("knowledge-grid");d.forEach(e=>{const t=document.createElement("div");t.className="k-card";let n="";e.cause||e.fix?n=`<p>${e.cause?`<strong>The Cause:</strong> ${e.cause}<br>`:""}${e.fix?`<strong>The Fix:</strong> ${e.fix}`:""}</p>`:e.text&&(n=`<p>${e.text}</p>`),t.innerHTML=`
      <h3>${e.title}</h3>
      ${n}
      <div class="code-block">
        <pre><code>${e.code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>
        <button class="copy-btn">Copy</button>
      </div>
    `,o.appendChild(t)})});
