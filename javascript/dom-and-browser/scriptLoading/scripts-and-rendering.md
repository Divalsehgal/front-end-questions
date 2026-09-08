# Browser Script Loading & Rendering Reference

---

## Part 1 — Script Loading Strategies

### 1. `preconnect` → always `<head>`

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
```

- Performs DNS + TCP + TLS handshake with the server early
- **No file is downloaded** — connection only
- In `<body>`: page is mostly parsed already, handshake benefit is gone
- **Use for:** third-party origins you'll fetch from soon (fonts, CDNs, APIs)

---

### 2. `preload` → always `<head>`

```html
<head>
  <link rel="preload" href="hero.jpg" as="image">
  <link rel="preload" href="font.woff2" as="font" crossorigin>
  <link rel="preload" href="app.js" as="script">
</head>
```

- Downloads early, **never executes** — you still need the actual tag to use it
- In `<body>`: browser already parsed most HTML, early download advantage is lost
- **Use for:** resources you're certain will be needed soon but browser would discover late on its own

---

### 3. `defer` → always `<head>`

```html
<!-- ✅ Correct -->
<head>
  <script defer src="app.js"></script>
</head>

<!-- ⚠️ Works but pointless — late discovery, defer adds nothing -->
<body>
  <script defer src="app.js"></script>
</body>
```

- Downloads in parallel, executes **after DOM is fully parsed**
- Execution order **guaranteed** across multiple deferred scripts
- **Best default choice** for most scripts that need the DOM

---

### 4. `async` → always `<head>`

```html
<!-- ✅ Correct -->
<head>
  <script async src="analytics.js"></script>
</head>

<!-- ⚠️ Works but late download — no benefit at all -->
<body>
  <script async src="analytics.js"></script>
</body>
```

- Downloads in parallel, executes **immediately when done** — doesn't wait for DOM
- **No order guarantee** — race condition, whichever downloads first runs first
- **Use for:** fully independent scripts like analytics that don't touch DOM or depend on other scripts

---

### 5. `dynamic import` → anywhere in JS

```javascript
// On user interaction
button.addEventListener('click', async () => {
  const { Modal } = await import('./modal.js')  // downloads only on click
  Modal.open()
})

// React lazy route
const Dashboard = React.lazy(() => import('./Dashboard'))  // downloads when rendered
```

- Not an HTML tag — lives in JS files
- Browser has **zero knowledge** of the file until that line runs
- Bundler automatically splits it into a **separate chunk** at build time
- **Use for:** things the user may never need — modals, heavy charts, route-level code

---

### 6. `inline script` → head or body depending on purpose

```html
<!-- In <head>: global config other scripts depend on -->
<head>
  <script>
    window.__CONFIG__ = { api: 'https://api.example.com', theme: 'dark' }
  </script>
</head>

<!-- In <body>: tiny DOM operation that needs elements to exist -->
<body>
  <script>
    document.getElementById('year').textContent = new Date().getFullYear()
  </script>
</body>
```

- No network request
- Executes **immediately**, blocks parsing wherever it sits
- `<head>`: for critical config that must exist before anything else
- `<body>`: for tiny DOM operations after elements exist
- **Never use for anything large**

---

## Part 2 — Full Comparison Table

| | Placement | Download | Executes | Blocks Parsing | Order Guaranteed |
|---|---|---|---|---|---|
| `preconnect` | head only | connection only | never | ❌ | — |
| `preload` | head only | immediately | you decide | ❌ | — |
| `defer` | head only | immediately | after DOM | ❌ | ✅ |
| `async` | head only | immediately | when downloaded | ⚠️ briefly | ❌ |
| `dynamic import` | JS anywhere | on demand | when downloaded | ❌ | ✅ |
| `inline` | head or body | no request | immediately | ✅ | — |

### Core Decision Rules

| Situation | Use |
|---|---|
| Need early connection to external origin | `preconnect` in head |
| Resource needed soon but discovered late | `preload` in head |
| Script needs DOM, order matters | `defer` in head |
| Fully independent script (analytics) | `async` in head |
| User may never need it | `dynamic import` |
| Tiny critical config or DOM op | `inline` |

---

## Part 3 — Browser Rendering Pipeline

After parsing, the browser converts the DOM into pixels through this pipeline:

```
HTML string ──► Parsing ──► DOM tree ──┐
                                        ├──► Render Tree (visible nodes only)
CSS string  ──► Parsing ──► CSSOM tree ┘
                                  │
                              Layout
                         (positions & sizes)
                                  │
                               Paint
                         (colors, text, borders)
                                  │
                            Composite
                        (layers: z-index, transform)
                                  │
                      User sees content on screen
```

### What each step does

| Step | What happens |
|---|---|
| **DOM** | What elements exist |
| **CSSOM** | What styles apply |
| **Render Tree** | DOM + CSSOM merged, only visible nodes |
| **Layout** | Browser calculates where and how big each element is |
| **Paint** | Browser draws colors, text, borders, shadows |
| **Composite** | Stacks layers (`z-index`, `transform`) together |

> **One line:** Parsing builds the tree, rendering turns that tree into pixels the user sees.

---

## Part 4 — SSR vs CSR

### CSR (Client-Side Rendering)

```
Browser receives:  <div id="root"></div>   ← almost nothing
                        │
              Wait for JS to download + execute
                        │
              JS generates HTML → React builds DOM
                        │
              User sees content             ← very late
```

### SSR (Server-Side Rendering)

```
Browser receives:  <div id="root"><h1>Hello</h1><p>content...</p></div>   ← full content
                        │
              User sees content immediately  ← very early
                        │
              JS downloads + hydrates later
```

### Comparison

| | CSR | SSR |
|---|---|---|
| HTML received | Empty shell | Full content |
| Parsing speed | Same | Same |
| Render Tree | Built after JS runs | Built immediately |
| First paint | Late | Early |

> **Note:** Parsing speed itself is the same in both — SSR wins because it gives the parser meaningful content from the start, eliminating the "wait for JS to generate HTML" step entirely.

### What hydration means

The DOM is already built from server HTML but is **static** — no event listeners, no React state. Hydration is React saying:

> *"DOM already exists, I won't re-render — I'll just attach event listeners and take over."*

```
Server HTML ──► DOM (visible, not interactive)
                          │
                      Hydration
                          │
               DOM (visible + interactive)
```
