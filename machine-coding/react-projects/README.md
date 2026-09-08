# React Machine Coding Challenges

A Vite + React + TypeScript app collecting React machine-coding interview challenges. Each challenge lives in its own folder under `src/challenges/`, grouped by category:

- `ui-widgets/` — carousel, progress bar, tic-tac-toe, modal, tabs, timer, etc.
- `forms/` — form validation, OTP input, comment reply box, mention box.
- `data-async/` — infinite scroll, auto-complete, Hacker News client, offline image cache.
- `state-architecture/` — reducer-based todo, feature flags, transfer list, multi-stepper.
- `algorithmic/` — snake & ladder, virtual DOM, folder structure, imperative handle.

## How challenges are registered

`src/challenges/index.ts` uses `import.meta.glob('./**/index.{tsx,ts,jsx,js}', { eager: true })` to auto-discover every challenge — dropping a new `<category>/<challenge-name>/index.tsx` file (with a default export and an optional `hint` named export) is enough for it to show up in the app, no manual registration needed. The challenge's key/URL is always derived from its leaf folder name, so nesting under a category doesn't change existing links.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run test     # vitest
```
