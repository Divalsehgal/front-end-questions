# Learning Gist: Infinite Scroll

### 🧠 The Core Logic
Efficiently fetching and appending data as the user scrolls, avoiding performance bottlenecks.

### 🛠️ Implementation Strategy
1. **Intersection Observer**: Attach an observer to a "sentinel" element (loader) at the bottom of the list.
2. **Fetch Logic**: When the sentinel is visible, trigger the `fetchNextPage` function.
3. **Guard Clauses**: Ensure you don't trigger multiple simultaneous fetches (use a `loading` flag).
4. **Data Accumulation**: Use `prev => [...prev, ...newItems]` to append data without losing existing state.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on **Virtualization** (rendering only visible items) vs simple Infinite Scroll.
- **Throttling**: Why Intersection Observer is better than listening to raw `onScroll` events (which fire dozens of times per second).
- **Error Handling**: How to let users retry a failed page fetch.

```javascript
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading) {
      loadMore();
    }
  });
  if (loaderRef.current) observer.observe(loaderRef.current);
  return () => observer.disconnect();
}, [loading]);
```
