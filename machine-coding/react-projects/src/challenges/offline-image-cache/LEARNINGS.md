# Learning Gist: Offline Image Cache (Service Workers)

### 🧠 The Core Logic
Intercepting network requests to cache assets locally, enabling offline availability.

### 🛠️ Implementation Strategy
1. **Service Worker Registration**: Register the worker in the main thread.
2. **Install Event**: Use `caches.open()` and `cache.addAll()` to store static assets.
3. **Fetch Event Interception**: Listen to all `fetch` events. Check if the resource is in the cache first; if not, fetch from network and dynamically cache the response.
4. **Cache Invalidation**: On the `activate` event, delete old caches to ensure the user gets fresh content.

### 🚀 FAANG Interview Tips
- **PWA Patterns**: Cache-first vs Network-first vs Stale-while-revalidate.
- **Quota**: How to handle storage limits in the browser.
- **Security**: Service workers only work on HTTPS (except localhost).

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```
