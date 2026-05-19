import"./styles-CNw9mgIE.js";const o=[{title:"Relationships (aria-controls & describedby)",cause:"Screen readers don't know visually that a button opens a specific panel below it, or that text below an input acts as a hint.",fix:'Use <code>aria-controls="id"</code> to link the button to the panel. Use <code>aria-describedby="hint-id"</code> on inputs to read supplementary text natively.',code:`<button aria-controls="panel1">
<div id="panel1">...</div>`},{title:"Replacing Text (aria-labelledby)",fix:"Instead of writing a hidden label for a Modal, point the modal's accessible name directly to its visible inner <code>&lt;h2&gt;</code> using <code>aria-labelledby</code>.",code:`<div role="dialog" aria-labelledby="h2-id">
  <h2 id="h2-id">Delete?</h2>`},{title:"Focus Management (tabIndex)",cause:"Custom components (like a div acting as a button) can't be navigated via the Keyboard.",fix:'Add <code>tabIndex="0"</code> to put it naturally in flow. Use <code>tabIndex="-1"</code> during Modals to trap focus or programmatically focus an element without disrupting normal tabbing.',code:'<div role="button" tabIndex="0">'},{title:"Dynamic Feedback (aria-live)",cause:"If a script pops up a Toast notification, sighted users see it, but blind users hear nothing.",fix:'Wrap the notification area in an <code>aria-live="polite"</code> region so the reader politely waits then announces the change.',code:`<div aria-live="polite">
  {statusMessage}
</div>`},{title:"Hiding (aria-hidden vs .sr-only)",fix:'<strong>aria-hidden="true":</strong> Hides a visual element (like decorative SVGs) from screen readers.<br><strong>.sr-only:</strong> CSS snippet that visually hides content from sighted users but forces screen readers to read it.',code:'<svg aria-hidden="true">...</svg>'},{title:"Page Language (lang attribute)",text:'The <code>lang</code> attribute (e.g. <code>lang="ar"</code> or <code>lang="en"</code>) on the <code>&lt;html&gt;</code> tag aids screen readers in correctly pronouncing content and helps SEO.',code:`<html lang="en">
  ...
</html>`},{title:"Accessibility Enhancements (Roles)",text:'Enhance accessibility using <code>role="region"</code> and <code>aria-labelledby</code> attributes to label sections. This works alongside semantic HTML.',code:`<section role="region" aria-labelledby="section-title">
  <h2 id="section-title">Title</h2>
  ...
</section>`},{title:"Prefers Reduced Motion",text:"Only apply smooth scrolling if the user hasn't explicitly requested reduced motion in their OS settings.",code:`@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}`}];document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("knowledge-grid");o.forEach(e=>{const t=document.createElement("div");t.className="k-card";let n="";e.cause||e.fix?n=`<p>${e.cause?`<strong>The Cause:</strong> ${e.cause}<br>`:""}${e.fix?`<strong>The Fix:</strong> ${e.fix}`:""}</p>`:e.text&&(n=`<p>${e.text}</p>`),t.innerHTML=`
      <h3>${e.title}</h3>
      ${n}
      <div class="code-block">
        <pre><code>${e.code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>
        <button class="copy-btn">Copy</button>
      </div>
    `,a.appendChild(t)})});
