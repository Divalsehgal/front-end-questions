# FE Grind

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

```
src/
  content/
    types.ts                 the question schema (one type per kind)
    registry.ts              flattens subjects → topics → questions
    files.ts                 loads code fixtures by naming convention
    subjects/<subject>/
      index.ts               the Subject definition (topics + questions)
      files/<id>.<part>.*    starter / tests / solution / types for code and UI questions
  questions/                 one view per question kind + registry.tsx (labels, icons, views)
  runtime/                   sandbox worker, test harness, console formatter, type checking
  ui/                        design system: primitives, CodeEditor, LivePreview, Prose, Layout
  pages/                     Dashboard, Subject, Question, Review, Mock, Session summary, Verify
```

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the tokens and components every screen uses.

## Adding questions

All content is typed data. Add an object to a topic's `questions` array in `src/content/subjects/<subject>/...`:

- **quiz**: `{ kind: 'quiz', id, title, prompt, code?, options, answer: 0 | [0, 2], why }`. Wrap code in backticks.
- **output**: `{ kind: 'output', id, title, code, lang?: 'ts', why }`. No answer key is stored: the expected output is whatever the code logs when it runs.
- **flashcard**: `{ kind: 'flashcard', id, title, front, back, code? }`. `back` supports bullets, tables, inline code and fenced code.
- **order**: `{ kind: 'order', id, title, prompt, items /* in the correct order */, why }`.
- **code**: `{ kind: 'code', id, title, prompt, ...code('<id>') }`, with files `files/<id>.starter.ts`, `<id>.tests.ts` (globals: `test`, `assert`, `fn`, `clock`; import from `./solution`), and optionally `<id>.solution.ts` and `<id>.types.ts` (every `// @ts-expect-error` line must error). Omit `.tests.ts` to make a pure type challenge.
- **ui**: `{ kind: 'ui', id, title, framework: 'react' | 'vanilla', prompt, requirements, ...ui('<id>') }`, with `files/<id>.starter.tsx|html` and optionally `<id>.solution.tsx|html`. React previews include Tailwind v4 and load any npm import from esm.sh.

Then run `npm test`, which checks every question in Node, or open **`/verify`** in dev to run the same checks in the browser. The browser version also renders every UI reference solution in a hidden preview and fails on runtime errors.

## CI and SonarCloud

`.github/workflows/ci.yml` runs on every push and pull request. It type-checks, builds, runs the Vitest suite with coverage, and sends the results to SonarCloud (`sonar-project.properties`). The content checks live in `src/content/content.test.ts`. They run each output snippet, run each reference solution against its tests and type tests, confirm each starter fails, and lint the quiz, flashcard and order questions.

The Sonar step needs a one-time setup. Import the repo at sonarcloud.io, turn off **Automatic Analysis**, and add the token as the `SONAR_TOKEN` repository secret.

## Deploying

The site is hosted on **Vercel** (`https://front-end-questions-lilac.vercel.app/`) through its Git integration: every
push to `main` deploys to production and every pull request gets a preview URL. `vercel.json` sets the build
(`npm run build` → `dist/`), trailing-slash URLs that match the prerendered folders, rewrites for the client-only
routes `/review/`, `/mock/` and `/session/`, year-long caching for hashed assets, and basic security headers.
GitHub Actions (`ci.yml`) only verifies; protect `main` with its `verify` check so failing code never reaches
production. The one-time manual setup is in [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## SEO and publishing

Every page with content is a real URL with its own static HTML, so search engines can index each question.

- **`SITE_URL`** is the only place the public address lives. It defaults to `https://front-end-questions-lilac.vercel.app/`.
  Override it at build time, for example `SITE_URL=https://fegrind.dev/ npm run build`, or set `SITE_URL` as a Vercel
  environment variable. Vite's `base`, canonical URLs, Open Graph tags, the sitemap and `robots.txt` all derive from
  it, so a custom domain is a one-line change.
- **`npm run build`** builds the client, builds `src/entry-server.tsx` for Node (`dist-ssr/`), then:
  - `scripts/prerender.js` writes `dist/<route>/index.html` for `/`, every `/s/<subject>/` and every
    `/q/<subject>/<id>/`. Each page has full HTML that the client then hydrates, plus its own `<title>`, description,
    canonical URL, Open Graph and Twitter tags and JSON-LD (`src/seo/`). Answers and explanations are in a collapsed
    "Show answer & explanation" disclosure, so they can be indexed without spoiling the question. Opening it before
    you answer counts as a reveal. The script also writes `404.html`: an empty, `noindex` app shell that Vercel serves
    for unknown URLs and that `vercel.json` rewrites `/review/`, `/mock/` and `/session/` to.
  - `scripts/generate-sitemap.js` writes `dist/sitemap.xml`, a sitemap index with one sitemap per subject under
    `dist/sitemaps/`, and `dist/robots.txt`. `<lastmod>` is the last git commit that touched the subject's folder.
- **Adding a question needs no SEO work.** Its page, meta tags, structured data and sitemap entry all come from the
  registry. `src/seo/sitemap.test.ts` fails if any question is missing from the sitemap.
- The favicon, app icons and the 1200×630 Open Graph image in `public/` come from `scripts/generate-icons.js`
  (`npm run icons`).

After the first deploy, the owner needs to verify the site in Google Search Console, submit
`https://front-end-questions-lilac.vercel.app/sitemap.xml` and request indexing for a few pages. Put the Search
Console verification code in the `GOOGLE_SITE_VERIFICATION` Vercel environment variable; the build injects the
`<meta name="google-site-verification">` tag into every page. The full list is in
[docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).
