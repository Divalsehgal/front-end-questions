# Step 5: Advanced Patterns

As your application grows, you need a way to keep your code clean and scalable. This section covers the **Architecture Patterns** that professional Next.js teams use to manage complex data requirements and large component trees.


## Component Strategy

- **Server Components:** Default choice. Zero client-side JavaScript. Used for SEO and initial page structure.
- **Client Components:** Used only for interactivity (e.g., Add to Cart, Variant Selectors). Use the `"use client"` directive at the top.
- **Optimization:** Keep client components at the leaves of the component tree to minimize the hydration payload.

## Data Fetching and Streaming

- **Streaming with Suspense:** Utilized for non-critical, slow data fetches (e.g., Reviews) to allow the rest of the page to render immediately.
- **Parallel Fetching:** Data fetching is localized within containers to enable concurrent requests and progressive rendering.

## Container-Presentational Pattern

- **Containers:** Server components that handle data fetching, transformations, and business logic (e.g., `ReviewsContainer`).
- **Presentational Components:** Pure components that receive data via props and focus solely on UI (e.g., `Reviews`).
- **Benefits:** Improves testability, separates concerns, and simplifies the component hierarchy.

## Navigation and SEO

- **Automatic Prefetching:** The `Link` component prefetches pages as they enter the viewport to reduce perceived latency.
- **Metadata:** Server components allow for easy integration with the Next.js Metadata API for robust SEO without client-side overhead.

## Best Practice: Server Data Utilities

- **Goal:** Centralize data fetching logic into reusable asynchronous functions (server-side "hooks").
- **Implementation:** Create dedicated utility files for fetching reviews, products, and categories to keep container components lean and logic DRY.
- **Advantage:** Enables consistent error handling and caching strategies across the server-side architecture.

## Data Strategy Comparison

- **Services (Async Functions):** Best for fetching data (GET) during server-side rendering. Direct execution, zero network overhead, and zero JS shipped.
- **Server Actions:** Used specifically for mutations (POST, PUT, DELETE). Triggered by user interaction (e.g., form submission).
- **API Routes:** Used for external access or when a standard REST endpoint is required. Adds network overhead and is generally slower than direct server calls.
- **Server Hooks:** Not a standard React concept; reusable async services provide similar benefits on the server without the constraints of React Hook rules.
