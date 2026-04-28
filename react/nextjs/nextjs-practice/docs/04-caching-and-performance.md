# Step 4: Caching and Performance

Next.js is famous for its speed, and that speed comes from its sophisticated **Multi-Layer Caching**. Understanding how to cache—and more importantly, how to *invalidate* that cache—is what separates a hobbyist from a pro.


## Multi-Layer Caching Strategy

Next.js applications utilize multiple layers of caching to optimize performance and reduce database load:

1. **Browser Cache:** Stores static assets (images, JS, CSS) on the user's device.
2. **CDN / Edge Cache:** Stores the HTML output of ISR pages close to the user's geographic location.
3. **Next.js Cache (Data Cache):** Stores results of `fetch` requests on the server, persistent across user requests and deployments.
4. **Database:** The primary source of truth for all application data.

## Invalidation Strategies

### 1. Time-Based Invalidation (ISR)

- **Mechanism:** `revalidate: 300` in the `fetch` options.
- **Use Case:** Non-critical data that can be slightly stale (e.g., blog posts, documentation).
- **Pros:** Automatic background updates with zero manual intervention.

### 2. Event-Driven Invalidation (Tags)

- **Mechanism:** `tags: ['products']` in `fetch` and `revalidateTag('products')` in a server action or API route.
- **Use Case:** Critical content that must update immediately after an admin change (e.g., product details, pricing updates).
- **Pros:** Instant global updates without waiting for a timer.

## Runtime Comparison

### Edge Runtime

- **Best For:** Fast, globally distributed delivery of static or ISR content.
- **Constraints:** Limited set of Node.js APIs; no heavy database drivers.
- **Strategy:** Use for the high-traffic frontend listing pages.

### Node.js Runtime

- **Best For:** Complex business logic, direct database access, and admin-side operations.
- **Capabilities:** Full access to the Node.js ecosystem and standard libraries.
- **Strategy:** Use for background jobs, authenticated API routes, and data mutations.

## Cache Stampede Prevention

Next.js provides built-in mechanisms to handle high-traffic spikes:

- **Stale-While-Revalidate:** Serves stale content while fetching fresh data in the background.
- **Request Deduplication:** Ensures that identical `fetch` requests within a single render cycle only happen once.

## Best Practice: Granular Invalidation

- **Rule:** Use specific tags (`product-123`) instead of broad tags (`products`) to avoid unnecessarily invalidating large portions of the cache.
- **Rule:** Combine ISR for general stability with Tag-based invalidation for precision.

---

### ⚡ Caching Strategy — When to Use What (End-to-End)

---

## 🧠 Full Stack Mental Model

```text
Browser Cache (Cache-Control)
        ↓
CDN / Edge Cache (Cache-Control)
        ↓
Next.js Page Cache (revalidate)
        ↓
Next.js Data Cache (fetch + tags)
        ↓
Database / API
```

---

## ⚡ 1. Page-Level Cache (`revalidate`)

```tsx
export const revalidate = 3600;
```

### ✅ Use when

- Whole page can be cached
- Data changes rarely

### 📦 Caches

- HTML + RSC payload

### ⚠️ Limitation

- Coarse control (entire page)

---

## ⚡ 2. Fetch-Level Cache

```tsx
await fetch("/api/products", {
  next: { revalidate: 300 },
});
```

### ✅ Use when

- Need **fine-grained control**
- Different parts of page have different freshness

### 📦 Caches

- API response (data)

---

## ⚡ 3. Tag-Based Invalidation

```tsx
await fetch("/api/products", {
  next: { tags: ["products"] },
});
```

```tsx
import { revalidateTag } from "next/cache";

revalidateTag("products");
```

### ✅ Use when

- Admin updates data
- Need **instant cache busting**

### 📦 Affects

- Next.js data cache
- All components using that tag

---

## ⚡ 4. HTTP Cache Headers (Browser + CDN)

```ts
return Response.json(data, {
  headers: {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  },
});
```

### ✅ Use when

- API is used by:

  - client-side fetch
  - mobile apps
  - external consumers

### 📦 Caches

- CDN (s-maxage)
- Browser (max-age if added)

---

## 🔥 Header Breakdown

```text
s-maxage=60              → CDN cache (60s)
stale-while-revalidate   → serve stale while updating
max-age=60               → browser cache
```

---

## ⚖️ When to Use What

| Use Case             | Strategy            |
| -------------------- | ------------------- |
| Static product page  | `revalidate`        |
| Mixed freshness page | `fetch revalidate`  |
| Admin update         | `revalidateTag`     |
| Public API           | `Cache-Control`     |
| Real-time data       | `cache: "no-store"` |

---

## 🚀 Real Production Example

```tsx
// page.tsx
export const revalidate = 3600;

const product = await fetch("/api/product", {
  next: { tags: ["product"] },
});

const price = await fetch("/api/price", {
  cache: "no-store",
});
```

---

```ts
// API route
return Response.json(product, {
  headers: {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  },
});
```

---

```ts
// Admin update
revalidateTag("product");
```

---

## ⚠️ Common Mistakes

```text
❌ Only using revalidate → stale data
❌ Only using headers → Next.js cache ignored
❌ Mixing TTLs incorrectly → inconsistent UI
```

---

## 🧠 Final Decision Framework

```text
Need global caching (CDN)? → Cache-Control
Need page caching?        → revalidate
Need data control?        → fetch cache
Need instant update?      → revalidateTag
Need real-time?           → no-store
```
