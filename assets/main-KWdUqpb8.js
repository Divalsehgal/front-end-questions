import"./styles-CNw9mgIE.js";const d=[{title:"Semantic Tags",code:`&lt;main&gt;
  &lt;article&gt;...&lt;/article&gt;
&lt;/main&gt;`,text:"Using explicit sectioning tags removes the need for abstract roles and provides native keyboard support out of the box."},{title:"ARIA Contracts",code:`aria-controls='id'
aria-labelledby='id'`,text:"ARIA binds separate elements together, proving context to screen readers where visual context fails."},{title:"Visual Fakers",code:`transform: skew(20deg);
clip-path: polygon(...);`,text:"CSS manipulation using transforms or masks generates complex geometry without bloating the DOM."},{title:"DOM vs BOM",code:`// DOM
document.getElementById('app');

// BOM
window.location.href;`,text:"<strong>DOM</strong> translates raw HTML into an object tree (<code>document</code>). <strong>BOM</strong> is the interface for the Browser Window (<code>window.location</code>, history, navigator)."},{title:"CSS: rem vs em Units",code:`h1 { font-size: 2rem; } /* 32px */
.parent { font-size: 1.5em; /* 24px */ }`,text:"<code>rem</code> relates to the root HTML font-size (usually 16px). <code>em</code> relates to the immediate parent's font-size, which can cause compounding sizing issues."},{title:"CSS: flex vs inline-flex",code:`.container {
  display: flex;
}
.inline-container {
  display: inline-flex;
}`,text:"<code>display: flex</code> creates a block-level container (full width). <code>display: inline-flex</code> creates an inline-level container (content width)."}],l=[{title:"1. The Main HTML Skeleton",description:"Every modern web page starts with a foundational skeleton. Below is the exact HTML structure we use for this project hub. The following sections break down the 'why' behind each block of this code.",code:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web HTML/CSS Knowledge Hub</title>

    <link rel="stylesheet" href="./styles.css" />
    <link rel="stylesheet" href="./home.css" />
    <script defer src="./wiki-data.js"><\/script>
    <script defer src="./script.js"><\/script>
    <script defer src="./home-data.js"><\/script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2..." rel="stylesheet">
  </head>
  <body>
    <!-- Application Content -->
  </body>
</html>`},{title:"2. Why are we choosing this Vanilla approach?",description:"This project is designed as a focused learning hub. By stripping away heavy frameworks like React or Vue, we ensure a deeper, hands-on understanding of native HTML semantics, core accessibility principles, and vanilla CSS capabilities without abstraction overhead."},{title:'3. HTML Skeleton: &lt;!DOCTYPE html&gt; &amp; &lt;html lang="en"&gt;',description:'<code>&lt;!DOCTYPE html&gt;</code> ensures the browser renders the page in HTML5 standards mode avoiding layout quirks. <code>&lt;html lang="en"&gt;</code> is the root element; the <code>lang</code> attribute is crucial for screen readers to use the correct pronunciation and search engines to index properly.'},{title:"4. Meta Tags: charset &amp; viewport",description:'<code>&lt;meta charset="UTF-8" /&gt;</code> ensures the browser natively supports virtually all characters and symbols globally. <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</code> is strictly required for responsive design, instructing mobile browsers to match the device width without artificially zooming out.'},{title:'5. Performance: &lt;link rel="preconnect"&gt;',description:"We use <code>preconnect</code> for domains like Google Fonts. This instructs the browser to aggressively negotiate the DNS, TCP, and TLS connections in the background, significantly minimizing latency when the CSS subsequently requests the font assets."},{title:"6. Performance: &lt;script defer&gt;",description:"The <code>defer</code> attribute instructs the browser to download the script file in parallel while continuing to parse the HTML. The script then executes strictly <em>after</em> the fully constructed DOM is ready. This is the optimal way to avoid 'render-blocking' delays."},{title:"7. Why 'defer' instead of 'async'?",description:"Both <code>defer</code> and <code>async</code> download scripts in the background. However, an <code>async</code> script executes <em>immediately</em> after it finishes downloading, pausing HTML parsing and ignoring script order. Because our <code>script.js</code> relies on data from <code>wiki-data.js</code>, using <code>async</code> could cause race conditions causing the app to break. <code>defer</code> strictly respects the order scripts appear in the standard document flow."},{title:"8. Why put scripts in the &lt;head&gt; tag?",description:"Historically, developers placed scripts at the very bottom of the <code>&lt;body&gt;</code> to prevent them from blocking the HTML setup. However, placing them in the <code>&lt;head&gt;</code> with the <code>defer</code> attribute is the modern best practice. It triggers the browser to begin fetching the script files much earlier in the network lifecycle, resulting in faster overall execution without interfering with the user's visual rendering."},{title:"9. Why separate scripts? (Separating Concerns)",description:"We strictly separate Structure (HTML), Presentation (CSS), and Behavior (JS). We even divide JS logic: <code>home-data.js</code> and <code>wiki-data.js</code> hold the raw data, and <code>script.js</code> handles events and rendering. This makes our Vanilla setup clean, scalable, and easy to inspect."}];document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("knowledge-grid");c&&typeof d<"u"&&d.forEach(e=>{const t=document.createElement("div");t.className="k-card",t.innerHTML=`
          <h3>${e.title}</h3>
          <p>${e.text}</p>
          <div class="code-block">
            <pre><code>${e.code}</code></pre>
            <button class="copy-btn">Copy</button>
          </div>
        `,c.appendChild(t)}),document.addEventListener("click",e=>{if(e.target.classList.contains("copy-btn")){const t=e.target,o=t.parentElement.querySelector("code").innerText;navigator.clipboard.writeText(o).then(()=>{t.innerText,t.innerText="Copied!",t.classList.add("copied"),setTimeout(()=>{t.innerText="Copy",t.classList.remove("copied")},2e3)}).catch(i=>{console.error("Failed to copy text: ",i),t.innerText="Error"})}}),document.querySelectorAll(".k-card").forEach((e,t)=>{e.style.opacity="0",e.style.transform="translateY(20px)",e.style.transition=`all 0.5s ease ${t*.1}s`,setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},100)});const r=document.getElementById("open-wiki-btn"),n=document.getElementById("wiki-modal");if(r&&n){const e=document.getElementById("wiki-content-container");e&&typeof l<"u"&&l.forEach(o=>{const i=document.createElement("div");i.className="wiki-section";let a=`
            <h3>${o.title}</h3>
            <p>${o.description}</p>
          `;if(o.code){const p=o.code.replace(/</g,"&lt;").replace(/>/g,"&gt;");a+=`
               <div class="code-block" style="margin-top: 1rem;">
                 <pre><code>${p}</code></pre>
                 <button class="copy-btn">Copy</button>
               </div>
             `}i.innerHTML=a,e.appendChild(i)});const t=n.querySelector(".modal-close");r.addEventListener("click",()=>{n.classList.add("open"),n.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"});const s=()=>{n.classList.remove("open"),n.setAttribute("aria-hidden","true"),document.body.style.overflow=""};t.addEventListener("click",s),n.addEventListener("click",o=>{o.target===n&&s()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&n.classList.contains("open")&&s()})}});
