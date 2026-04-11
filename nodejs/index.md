# 🚀 Node.js Core: Event Loop & Libuv

## 1. The Priority Rule (Microtasks)
Executed **immediately** after the current operation finishes, before moving to the next phase of the Event Loop.
1. `process.nextTick()` (Highest priority, runs before Promises)
2. `Promise.then()` (Microtask queue)

## 2. Event Loop Phases (The "Macro" Tasks)
1. **Timers**: `setTimeout`, `setInterval`.
2. **Pending Callbacks**: I/O callbacks deferred from previous loop.
3. **Idle, Prepare**: Internal use only.
4. **Poll**: Retrieve new I/O events. Node will block here if nothing else is scheduled.
5. **Check**: `setImmediate()` callbacks.
6. **Close Callbacks**: `socket.on('close', ...)`.

## 3. Libuv & The Thread Pool
Libuv is the C library that handles the Event Loop and Asynchronous I/O.
- **Thread Pool Default**: 4 threads (can be changed via `UV_THREADPOOL_SIZE=n`).
- **What uses the Thread Pool?**
  - **File I/O**: `fs` modules (mostly).
  - **Crypto**: `crypto.pbkdf2`, `crypto.randomBytes`.
  - **Zlib**: Compression.
  - **DNS Lookups**: `dns.lookup`.
- **What DOES NOT use it?** Network I/O (sockets). The OS handles these via epoll/kqueue.

## 4. `setImmediate` vs `setTimeout(0)`
- **Inside I/O callback**: `setImmediate` always runs first.
- **Outside I/O**: Execution order is non-deterministic (depends on performance).

## 💡 Interview Tip
If an interviewer asks "Is Node single-threaded?", the answer is: **"The Event Loop is single-threaded, but Libuv provides a thread pool for heavy/blocking tasks."**

---
> [!IMPORTANT]
> A long-running `nextTick` can starve the Event Loop (prevent it from ever moving to the next phase). Always use it sparingly!

---

## 🏗️ Real-World & Framework Context

### 1. Next.js / SSR Blocking
Next.js runs on this single Event Loop. If you do heavy computation in a **Server Component** or `getServerSideProps`, you block the server for **ALL users**. Node cannot handle new requests until your CPU-bound loop finishes.

### 2. React Streaming (Suspense)
React 18+ uses the Event Loop to stream HTML chunks. While waiting for a "slow" DB query inside a Suspense boundary, the Event Loop stays free to serve other users' simpler UI parts. This is why Node is the king of **I/O bound** apps.

### 3. The JSON.parse Trap
`JSON.parse()` and `JSON.stringify()` on large objects (10MB+) are **Synchronous**. They block the Event Loop and are not offloaded to Libuv. This is the most common cause of performance degradation in Node.js APIs.

### 4. Database Drivers
When you do `const user = await db.find()`, the Event Loop registers a callback in the **Poll Phase** and then **moves on**. It doesn't sit idle. This is why Node can handle 10k+ concurrent DB connections with a single thread.

---
> [!TIP]
> **Cardinal Rule**: Never use Node for Heavy Math (Video encoding, Big Data). Use Node for **Orchestration** (Taking data from A and sending it to B).