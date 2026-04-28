# Step 1: Rendering Fundamentals

Next.js is a **Server-First** framework. To explain it to someone, you must start with the core shift: we are moving from "everything is in the browser" to "most things stay on the server."


## Hydration Mismatch

Hydration is the process where React in the browser "takes over" the static HTML sent by the server. A mismatch occurs if the Server HTML and Client HTML are different.

### Root Causes

- **Non-Deterministic Data:** Using `Date.now()` or `Math.random()` directly in the render function.
- **Browser-Only APIs:** Accessing `window` or `localStorage` during the initial render.
- **HTML Structure Errors:** Invalid nesting (e.g., a `<p>` tag inside another `<p>` tag).

### The Fix: Two-Pass Rendering

To safely render client-specific data, use the `useEffect` hook to ensure the code only runs on the client after the initial hydration is complete.

## RSC Boundaries (Server vs. Client)

Next.js applications should maximize the use of **Server Components** to reduce the amount of JavaScript sent to the browser.

### Strategy: Strict Boundaries

- **Default to Server:** Every component is a Server Component by default (0 JS).
- **Leaf-Level Interactivity:** Move `"use client"` as far down the component tree as possible.
- **Example:** A static `ProductCard` (Server) should contain a small `LikeButton` (Client), rather than making the entire card a client component.

## RSC Payload (Flight)

The RSC Payload is a compact, serialized description of your component tree. It is sent from the server to the client and contains:

- The rendered HTML instructions for Server Components.
- The props needed for Client Components.
- Placeholders for where Client Components should be injected.

### Performance Benefits

- **No JS for Server Parts:** The browser doesn't download JS for code that only runs on the server.
- **Streaming:** The payload can be streamed to the browser, allowing parts of the page to appear before the full request is finished.

## Best Practices

1. **Isolate Interactivity:** Don't let a small interactive feature (like a toggle) force an entire heavy layout into the client bundle.
2. **Deterministic Rendering:** Ensure your server-side logic produces the exact same output as the client-side hydration pass.
3. **Minimize Props:** Avoid passing massive data objects from Server Components to Client Components; pass only what is strictly necessary.
