# Next.js Hydration Errors

> Hydration mismatch makes React throw away server HTML and re-render from scratch on the client — killing SSR's benefits.

### How to fix:
1. Isolate dynamic values to client components with `useEffect`.
2. Use `ssr: false` for browser-only code components when dynamically importing.
3. Use the `suppressHydrationWarning` attribute natively on the HTML element if the mismatch is intentional or unavoidable.

---

## SSR Configuration Details

| Feature               | `ssr: true` | `ssr: false` |
| --------------------- | ----------- | ------------ |
| SEO                   | ✅           | ❌            |
| Performance (initial) | ✅           | ❌            |
| Client interactivity  | ✅           | ✅            |
| Browser APIs          | ❌           | ✅            |
