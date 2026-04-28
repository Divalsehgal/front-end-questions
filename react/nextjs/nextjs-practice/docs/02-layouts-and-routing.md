# Step 2: Layouts and Routing

Once you understand that components are server-side by default, the next step is understanding how they are organized. Next.js uses a **File-based App Router** that treats the folder structure as the URL path.


## Layout Persistence

Next.js layouts (`layout.tsx`) are persistent across navigations. When a user moves between pages in the same directory, only the `page.tsx` component is swapped.

- **UI Shell:** Use layouts for stable UI elements like Navbars, Footers, and Sidebar navigation.
- **State Preservation:** Because layouts do not re-mount, any client-side state within them (or their providers) is preserved during navigation.
- **Layout vs Template:** Use `layout.tsx` for persistence (default). Use `template.tsx` only if you explicitly need components to re-mount (e.g., for entrance animations).

## State Management Strategies

### 1. Global Interactive State (Context)

- **Pattern:** Wrap the root layout in a Context Provider.
- **Use Case:** State that must be accessible across the entire application and doesn't need to be shareable via URL (e.g., Shopping Cart, User Authentication).
- **Implementation:** Keep providers at the layout level to ensure they remain mounted.

### 2. Sharable/Navigable State (URL)

- **Pattern:** Use URL Search Parameters (`?category=shoes`) instead of Context for filtering and sorting.
- **Use Case:** Product filters, pagination, and search queries.
- **Benefits:**
  - **Shareability:** Users can copy and paste the URL to share the exact view.
  - **Persistence:** State survives page refreshes and works correctly with the browser's back/forward buttons.
  - **SEO:** Search engines can crawl different filtered versions of the page.

## Data Fetching Guidelines

- **Page Level:** Fetch data in `page.tsx` based on search parameters to ensure the content stays in sync with the URL.
- **Avoid Layout Fetching:** Do not fetch frequently changing data in `layout.tsx`, as it may not re-fetch during client-side navigation, leading to stale data.

## Best Practice: State Localization

- **Rule:** Localize state as much as possible. Only elevate to Context if the state is truly global.
- **Rule:** Use the URL for any state that affects the data being displayed on the page.
