# FE Questions

An interactive practice app for frontend interviews. Everything that used to live in this repo as notes and solutions
(JavaScript, TypeScript, React, Next.js, HTML, CSS, DSA, design patterns, system design, testing, Node.js and machine
coding) has been turned into questions you answer, with feedback after every one.

```bash
npm install
npm run dev        # open the URL it prints
```

## Question types

| Type                 | How it works                                                                                                                                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quiz**             | Multiple choice, single or "select all that apply". Options are shuffled each time and every question has an explanation. Keys `1`–`n` and `Enter`.                                                                                                                                    |
| **Guess the output** | Read a JS/TS snippet and type what it logs. It really runs in a sandboxed worker and your answer is compared line by line, with the wrong words underlined.                                                                                                                            |
| **Coding drill**     | Implement a function or class in a TypeScript editor (Monaco). **Run tests** runs a real test suite in your browser, and some drills also have type tests. Type challenges (`MyPick`, `infer`…) are judged by the type checker alone. A reference solution unlocks after you solve it. |
| **Machine coding**   | Build a UI (React + TS, or HTML/CSS/JS) with a **live preview**, tick off a requirements checklist, then compare with the reference solution.                                                                                                                                          |
| **Flashcard**        | Recall a concept, reveal the answer, and rate yourself honestly.                                                                                                                                                                                                                       |
| **Order**            | Drag steps into the right sequence (RADIO, the rendering pipeline, the Node event loop phases…).                                                                                                                                                                                       |

Across all types:

- **Review** uses spaced repetition: misses come back right away, and hits come back after 1 → 3 → 7 → 14 → 30 days.
- **Mock round** is a timed mix from any subjects and types.
- The **Dashboard** shows progress per subject and your weakest topics.

Progress and code drafts are stored in the browser (localStorage).

## Where the old folders went

| Old folder                                                | Now                                                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `javascript/`                                             | **JavaScript**: event loop, closures, `this`, hoisting, coercion, objects/prototypes, generators, performance, and ~40 utility/polyfill drills |
| `typescript/`                                             | **TypeScript**: fundamentals, generics and utility types (type challenges), narrowing, React + TS                                              |
| `react/` (hooks MCQ, rendering, context, redux)           | **React**: the 50 hooks questions, Fiber/rendering, Redux store & combineReducers drills                                                       |
| `react/nextjs/`                                           | **Next.js**: RSC & hydration, layouts, Server Actions, caching, PDP architecture                                                               |
| `html/web/` (labs)                                        | **HTML, DOM & accessibility**: semantics, ARIA, forms, loading/rendering, plus build-it drills                                                 |
| `css/`                                                    | **CSS**: cascade and box model, architecture, effects, layout drills                                                                           |
| `dsa/`                                                    | **Data structures & algorithms**: 30 drills (covering 50+ problems) with tests that also catch slow solutions                                  |
| `design-patterns/`, `principles/`, `machine-coding/oops/` | **Design patterns & principles**: GoF patterns, SOLID, parking-lot LLD                                                                         |
| `system-design/`                                          | **Frontend system design**: RADIO, rendering and data choices, classic prompts                                                                 |
| `testing/`                                                | **Testing**: pyramid, FIRST, RTL, Playwright, build `jest.fn()`                                                                                |
| `nodejs/`                                                 | **Node.js**: event loop phases, libuv, module caching                                                                                          |
| `machine-coding/`                                         | **Machine coding**: 32 React challenges and 12 vanilla projects with live previews                                                             |

The original folders are still in git history (`git show main:<path>`).

## Project structure

A Turborepo with npm workspaces. Each package ships its TypeScript source; the app compiles it (`transpilePackages`).

```
apps/web/                    @fe-grind/web: the Next.js app (deployed to Vercel)
  src/app/                   App Router: one page.tsx per URL, thin wrappers around screens/; route handlers for SEO files
  src/screens/               Dashboard, Subject, Question, Review, Mock, Session summary, Settings, Verify
  src/questions/             one view per question kind + registry.tsx (labels, icons, views)
  src/shell/                 Layout (sidebar, search) and the Welcome card
  src/state/                 progress, profile, storage (localStorage, IndexedDB, file sync)
  src/seo/                   metadata, JSON-LD, sitemap, llms.txt
  scripts/                   check-build (postbuild), architecture diagram, icons
packages/
  content/                   @fe-grind/content: the question bank
    src/types.ts             the question schema (one type per kind)
    src/registry.ts          flattens subjects → topics → questions
    src/subjects/<subject>/  index.ts (topics + questions) and files/<id>.<part>.* fixtures
    scripts/generate.mjs     writes src/generated/ (fixtures, manifest with git dates)
  ui/                        @fe-grind/ui: design system, CodeEditor, LivePreview, styles.css, theme
  runtime/                   @fe-grind/runtime: sandbox worker, test harness, console formatter, type checking
  dsa/                       @fe-grind/dsa: DSA pattern exercises, tracer and traces
```

Dependencies only point down: `apps/web` → packages, and packages never import each other's internals except through
their `exports` (ESLint's `no-restricted-imports` enforces it). Run any task for one package with
`npx turbo run test --filter=@fe-grind/ui`.

## Rendering and caching

Next.js 16 with `cacheComponents` and the React Compiler (`next.config.ts`).

- Every public page (`/`, `/s/<subject>/`, `/q/<subject>/<id>/`, `/dsa/…`) is prerendered at build time from
  `generateStaticParams`. Unknown params are not in the static set and answer 404 (`notFound()`).
- Content only changes with a deploy, so the sitemap data is a `'use cache'` function with `cacheLife('max')` and the
  `content` tag (`apps/web/src/app/sitemaps/build.ts`). Call `revalidateTag('content')` if content ever comes from
  somewhere other than the build.
- Progress lives in the browser, so anything that depends on it renders after hydration. The clock is read through
  `useNow()` (`useSyncExternalStore` with a server snapshot), never `Date.now()` during render, which Cache
  Components would reject at prerender.
- Turbo caches `generate`, `build`, `typecheck`, `lint` and `test` by their inputs (`turbo.json`). Set `TURBO_TOKEN`
  and `TURBO_TEAM` in CI to share the cache remotely.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the tokens and components every screen uses.

## Adding questions

All content is typed data. Add an object to a topic's `questions` array in `packages/content/src/subjects/<subject>/...`:

- **quiz**: `{ kind: 'quiz', id, title, prompt, code?, options, answer: 0 | [0, 2], why }`. Wrap code in backticks.
- **output**: `{ kind: 'output', id, title, code, lang?: 'ts', why }`. No answer key is stored: the expected output is whatever the code logs when it runs.
- **flashcard**: `{ kind: 'flashcard', id, title, front, back, code? }`. `back` supports bullets, tables, inline code and fenced code.
- **order**: `{ kind: 'order', id, title, prompt, items /* in the correct order */, why }`.
- **code**: `{ kind: 'code', id, title, prompt, ...code('<id>') }`, with files `files/<id>.starter.ts`, `<id>.tests.ts` (globals: `test`, `assert`, `fn`, `clock`; import from `./solution`), and optionally `<id>.solution.ts` and `<id>.types.ts` (every `// @ts-expect-error` line must error). Omit `.tests.ts` to make a pure type challenge.
- **ui**: `{ kind: 'ui', id, title, framework: 'react' | 'vanilla', prompt, requirements, ...ui('<id>') }`, with `files/<id>.starter.tsx|html` and optionally `<id>.solution.tsx|html`. React previews include Tailwind v4 and load any npm import from esm.sh.

Then run `npm test`, which checks every question in Node, or open **`/verify`** in dev to run the same checks in the browser. The browser version also renders every UI reference solution in a hidden preview and fails on runtime errors.

## CI and SonarCloud

`.github/workflows/ci.yml` runs on every push and pull request. It type-checks, builds, runs the Vitest suite with coverage, and sends the results to SonarCloud (`sonar-project.properties`). Turbo runs each package's tasks and skips the ones whose inputs did not change. The content checks live in `packages/content/src/content.test.ts`. They run each output snippet, run each reference solution against its tests and type tests, confirm each starter fails, and lint the quiz, flashcard and order questions.

The Sonar step needs a one-time setup. Import the repo at sonarcloud.io, turn off **Automatic Analysis**, and add the token as the `SONAR_TOKEN` repository secret.

## Deploying

The site is hosted on **Vercel** (`https://front-end-grind.vercel.app/`) through its Git integration: every
push to `main` deploys to production and every pull request gets a preview URL. The Vercel project's Root Directory
is `apps/web`. `apps/web/vercel.json` sets the build (framework Next.js, `turbo run build`), skips deploys that don't
touch the app or its packages (`npx turbo-ignore`), the old-domain redirect and basic security headers. Trailing-slash
URLs are set in `apps/web/next.config.ts`.
GitHub Actions (`ci.yml`) only verifies; protect `main` with its `verify` check so failing code never reaches
production. The one-time manual setup is in [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## SEO and publishing

Every page with content is a real URL with its own static HTML, so search engines can index each question.

- **`SITE_URL`** is the only place the public address lives. It defaults to `https://front-end-grind.vercel.app/`.
  Override it at build time, for example `SITE_URL=https://fegrind.dev/ npm run build`, or set `SITE_URL` as a Vercel
  environment variable. the Next base path, canonical URLs, Open Graph tags, the sitemap and `robots.txt` all derive from
  it, so a custom domain is a one-line change.
- **`npm run build`** runs `next build` (Next.js App Router, routes in `apps/web/src/app/`):
  - It statically renders `/`, every `/s/<subject>/` and every `/q/<subject>/<id>/` (`generateStaticParams`). Each
    page has full HTML that the client then hydrates, plus its own `<title>`, description, canonical URL, Open Graph
    and Twitter tags (`generateMetadata`) and JSON-LD (`apps/web/src/seo/`). Answers and explanations are in a collapsed
    "Show answer & explanation" disclosure, so they can be indexed without spoiling the question. Opening it before
    you answer counts as a reveal. `/review/`, `/mock/`, `/session/`, `/settings/` and `/architecture/` render in the
    browser only and are `noindex`; unknown URLs answer 404 and send people to the dashboard.
  - Static route handlers in `apps/web/src/app/` serve `sitemap.xml` (an index with one sitemap per subject under
    `sitemaps/`), `robots.txt`, `llms.txt` and `llms-full.txt`. `<lastmod>` comes from git.
  - `apps/web/scripts/check-build.mjs` (postbuild) fails the build if a public page lacks its `<h1>` or its content is not inline.
- **`generate`** (a turbo task that runs before dev, build, typecheck and tests) writes each package's
  `src/generated/`: the subjects' code fixtures and the content manifest with git dates (`@fe-grind/content`), and
  React's type files for the editor (`@fe-grind/ui`).
- **Adding a question needs no SEO work.** Its page, meta tags, structured data and sitemap entry all come from the
  registry. `apps/web/src/seo/sitemap.test.ts` fails if any question is missing from the sitemap.
- The favicon, app icons and the 1200×630 Open Graph image in `apps/web/public/` come from
  `apps/web/scripts/generate-icons.js` (`npm run icons -w @fe-grind/web`).

After the first deploy, the owner needs to verify the site in Google Search Console, submit
`https://front-end-grind.vercel.app/sitemap.xml` and request indexing for a few pages. Put the Search
Console verification code in the `GOOGLE_SITE_VERIFICATION` Vercel environment variable; the build injects the
`<meta name="google-site-verification">` tag into every page. The full list is in
[docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).
