# Learning Gist: Hacker News Reader

### 🧠 The Core Logic
Fetching and displaying paginated data from a public API with clean error handling and loading states.

### 🛠️ Implementation Strategy
1. **API Integration**: Use `fetch()` or `axios`.
2. **Hydration**: Often involves a two-step fetch (Fetch list of story IDs -> Fetch individual story details for those IDs).
3. **Promise.all()**: Use this to fetch all story details in parallel for faster loading.
4. **Pagination**: Manage `page` state and increment it on click.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on **Caching** (storing previously fetched stories so they don't reload on pagination change).
- **Concurrency**: Handling race conditions if the user changes pages rapidly (abort controllers).

```javascript
const ids = await fetch('...topstories.json').then(r => r.json());
const stories = await Promise.all(
  ids.slice(0, 10).map(id => fetch(`...item/${id}.json`).then(r => r.json()))
);
```
