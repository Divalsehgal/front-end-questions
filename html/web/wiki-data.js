const wikiData = [
  {
    title: "1. The Main HTML Skeleton",
    description: "Every modern web page starts with a foundational skeleton. Below is the exact HTML structure we use for this project hub. The following sections break down the 'why' behind each block of this code.",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web HTML/CSS Knowledge Hub</title>

    <link rel="stylesheet" href="./styles.css" />
    <link rel="stylesheet" href="./home.css" />
    <script defer src="./wiki-data.js"></script>
    <script defer src="./script.js"></script>
    <script defer src="./home-data.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2..." rel="stylesheet">
  </head>
  <body>
    <!-- Application Content -->
  </body>
</html>`
  },
  {
    title: "2. Why are we choosing this Vanilla approach?",
    description: "This project is designed as a focused learning hub. By stripping away heavy frameworks like React or Vue, we ensure a deeper, hands-on understanding of native HTML semantics, core accessibility principles, and vanilla CSS capabilities without abstraction overhead."
  },
  {
    title: "3. HTML Skeleton: &lt;!DOCTYPE html&gt; &amp; &lt;html lang=\"en\"&gt;",
    description: "<code>&lt;!DOCTYPE html&gt;</code> ensures the browser renders the page in HTML5 standards mode avoiding layout quirks. <code>&lt;html lang=\"en\"&gt;</code> is the root element; the <code>lang</code> attribute is crucial for screen readers to use the correct pronunciation and search engines to index properly."
  },
  {
    title: "4. Meta Tags: charset &amp; viewport",
    description: "<code>&lt;meta charset=\"UTF-8\" /&gt;</code> ensures the browser natively supports virtually all characters and symbols globally. <code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /&gt;</code> is strictly required for responsive design, instructing mobile browsers to match the device width without artificially zooming out."
  },
  {
    title: "5. Performance: &lt;link rel=\"preconnect\"&gt;",
    description: "We use <code>preconnect</code> for domains like Google Fonts. This instructs the browser to aggressively negotiate the DNS, TCP, and TLS connections in the background, significantly minimizing latency when the CSS subsequently requests the font assets."
  },
  {
    title: "6. Performance: &lt;script defer&gt;",
    description: "The <code>defer</code> attribute instructs the browser to download the script file in parallel while continuing to parse the HTML. The script then executes strictly <em>after</em> the fully constructed DOM is ready. This is the optimal way to avoid 'render-blocking' delays."
  },
  {
    title: "7. Why 'defer' instead of 'async'?",
    description: "Both <code>defer</code> and <code>async</code> download scripts in the background. However, an <code>async</code> script executes <em>immediately</em> after it finishes downloading, pausing HTML parsing and ignoring script order. Because our <code>script.js</code> relies on data from <code>wiki-data.js</code>, using <code>async</code> could cause race conditions causing the app to break. <code>defer</code> strictly respects the order scripts appear in the standard document flow."
  },
  {
    title: "8. Why put scripts in the &lt;head&gt; tag?",
    description: "Historically, developers placed scripts at the very bottom of the <code>&lt;body&gt;</code> to prevent them from blocking the HTML setup. However, placing them in the <code>&lt;head&gt;</code> with the <code>defer</code> attribute is the modern best practice. It triggers the browser to begin fetching the script files much earlier in the network lifecycle, resulting in faster overall execution without interfering with the user's visual rendering."
  },
  {
    title: "9. Why separate scripts? (Separating Concerns)",
    description: "We strictly separate Structure (HTML), Presentation (CSS), and Behavior (JS). We even divide JS logic: <code>home-data.js</code> and <code>wiki-data.js</code> hold the raw data, and <code>script.js</code> handles events and rendering. This makes our Vanilla setup clean, scalable, and easy to inspect."
  }
];

export default wikiData;
