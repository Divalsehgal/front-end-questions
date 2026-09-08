# Front-End Interview Prep

This repo is my go-to place to recap before an interview — solutions, notes, and machine-coding practice organized by topic so I can jump straight to what I need to refresh.

## How the pieces connect

The folders below split roughly into **theory/notes** (`javascript/`, `typescript/`, `dsa/`, `react/`, `css/`, `design-patterns/`, `principles/`) and **hands-on practice** (`machine-coding/`, `html/web/` labs). They're meant to be read together, not in isolation — e.g. the closure theory in `javascript/core-language/closure` explains *why* half of `react/hooks-mcq.md`'s questions behave the way they do, and `design-patterns/` links out to the applied OOP example in `machine-coding/oops/ParkingLot`. Where a concept shows up in more than one place, look for a "See also" line pointing to the other one instead of duplicated content.

## Folder Structure

### 1. `javascript/`
Core JS concepts, grouped by theme:
- `core-language/` — hoisting, closures, IIFEs, prototypes/inheritance, classes, generators, iterators, tagged templates, property flags/get-set, typecasting, objects.
- `async/` — promises (cheat sheet + custom implementations), callbacks.
- `oop-patterns/` — event emitter, default props, method chaining (JS idioms — not the same as the formal GoF patterns in `design-patterns/` below).
- `memory-and-performance/` — garbage collection, memory leaks, debounce/throttle.
- `dom-and-browser/` — script loading strategies.
- `polyfills/` — hand-rolled implementations of array methods and common utilities.
- `practice-problems/` — grind problems and standalone coding drills.

### 2. `typescript/`
TypeScript practice and reference notes: `fundamentals/`, `advanced-types/`, `async-and-decorators/`, `react-typescript/`. See `typescript/README.md` for the full index.

### 3. `dsa/` (Data Structures & Algorithms)
One topic-first folder per data structure/technique — no separate "leetcode" tree, everything lives with its topic:
`arrays-strings/`, `two-pointer/`, `hash-table/`, `stacks-queues/`, `linked-list/`, `searching/`, `sorting/`, `trees/`, `graphs/`, `heap-priority-queue/`, `backtracking/`, `dynamic-programming/` (`patterns/` for the classic recursive-vs-tabulation pairs, `problems/` for applied LeetCode problems).

### 4. `html/` & `css/`
- **`html/web/`** — an interactive vanilla-JS learning hub with three labs: semantic forms, accessibility (ARIA/focus/live regions), and CSS shapes (`clip-path`).
- **`css/`** — `architecture.md` (BEM/OOCSS/SMACSS/Utility-first), `visual-effects.md` (masking, clip-path, transforms), `build-tooling.md` (pre/post-processors).

### 5. `react/` & `nodejs/`
- **`react/`** — `rendering-cycle/`, `context/`, `redux/` (vs Context), `nextjs/` (+ a full Next.js practice app), and `hooks-mcq.md` (50 self-test questions on hook behavior with an answer key).
- **`nodejs/`** — event loop & libuv notes, module-caching demo.

### 6. `design-patterns/` & `principles/`
- **`design-patterns/`** — GoF patterns grouped by category: `creational/`, `structural/`, `behavioral/`. See `design-patterns-summary.md` for the index.
- **`principles/`** — DRY, KISS, YAGNI, SOLID.

### 7. `machine-coding/`
Hands-on implementation challenges:
- `js-projects/` — vanilla HTML/CSS/JS widgets, grouped into `ui-widgets/`, `forms/`, `data-fetching/`, `layout-css/`.
- `react-projects/` — a Vite + React + TypeScript app with 30+ auto-registered challenges under `src/challenges/`, grouped into `ui-widgets/`, `forms/`, `data-async/`, `state-architecture/`, `algorithmic/` (see its own README for how challenge auto-discovery works).
- `oops/` — applied OOP class design (e.g. `ParkingLot`), cross-linked with `design-patterns/`.

### 8. `system-design/` & `testing/`
- **`system-design/`** — the RADIO framework for front-end system design interviews (still light — a recap checklist, not full case studies).
- **`testing/`** — shallow vs mount, FIRST principles, the testing pyramid, an E2E example.

## Usage

Explore folders based on what you need to recap. Code is meant for reference and self-quizzing, not just copy-paste.
