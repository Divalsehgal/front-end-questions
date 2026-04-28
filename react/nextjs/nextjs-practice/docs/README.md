# Next.js: Top to Bottom Guide

This documentation is structured to take you from the core mental model of Next.js to advanced production patterns.

## 🧭 The Learning Path

### [1. Rendering Fundamentals](./01-rendering-fundamentals.md)
**The "Why" of Next.js.** Understand React Server Components (RSC), the difference between Server and Client components, and how Hydration works. This is the foundation of everything else.

### [2. Layouts and Routing](./02-layouts-and-routing.md)
**The "Where" of your App.** Learn how Next.js handles persistent layouts, nested routing, and the critical distinction between Global State (Context) and Shareable State (URL).

### [3. Mutations and Actions](./03-mutations-and-actions.md)
**The "How" of Data Change.** Explore Server Actions as the primary way to handle data mutations with progressive enhancement, and when to fall back to standard Route Handlers (APIs).

### [4. Caching and Performance](./04-caching-and-performance.md)
**The "Fast" of Next.js.** A deep dive into the four layers of caching (Browser, Edge, Data, and Page) and how to handle cache invalidation using Tags and ISR.

### [5. Advanced Patterns](./05-advanced-patterns.md)
**The "Scale" of your Architecture.** Best practices for structuring large applications, using the Container-Presentational pattern on the server, and optimizing component boundaries.

### [6. Real-World Case Study: PDP](./06-real-world-case-study.md)
**The "Real" Implementation.** See all the concepts applied to a high-performance Product Detail Page (PDP), balancing static content, dynamic pricing, and streamed reviews.

---

## 🚀 Quick Mental Model
- **Default to Server:** Ship 0KB of JavaScript by default.
- **Client for Interactivity:** Only use `"use client"` when you need hooks (useState, useEffect) or browser APIs.
- **URL is State:** If it can be shared via a link, it should be in the URL.
- **Actions for Changes:** Use Server Actions for forms and mutations; they are safer and faster than manual APIs.
