# Design system

Every screen is built from the same tokens and components, so new question types and pages look consistent, support
dark mode without extra work, and meet **WCAG 2.2 AA**. Styling is Tailwind v4; tokens are exposed to it through
`@theme` in `src/index.css`.

## Palette

Three brand colours drive everything:

| Brand | Hex       | Role                                                                    |
| ----- | --------- | ----------------------------------------------------------------------- |
| Cream | `#f9ebe0` | Light canvas; text colour in dark mode                                  |
| Teal  | `#208aae` | Focus ring, selected borders, progress fill, icons (**not** small text) |
| Navy  | `#0d2149` | Light-mode text and primary buttons; dark-mode surface                  |

Teal is only 3.4:1 on cream and 3.9:1 on the light surface, so it passes the 3:1 bar for non-text UI but fails 4.5:1
for body text. Brand-coloured text uses **`--brand-strong`**: a darker teal in light mode, a lighter one in dark mode.

### Tokens and measured contrast

Ratios are WCAG 2.x relative-luminance contrast, measured by `npm run check:contrast` (the same check runs in CI as
`src/test/contrast.test.ts`). Text pairs need ≥ 4.5:1, non-text UI pairs ≥ 3:1.

| Token             | Light     | Dark      | Checked against (lowest ratio light / dark)          |
| ----------------- | --------- | --------- | ---------------------------------------------------- |
| `--canvas`        | `#f9ebe0` | `#071530` | app background                                       |
| `--surface`       | `#fffcf9` | `#0d2149` | cards, sidebar                                       |
| `--surface-muted` | `#f3e2d4` | `#172e5c` | hover rows, inline code, tracks                      |
| `--code-bg`       | `#fff6ee` | `#0a1a3d` | code blocks, answer box                              |
| `--border`        | `#e6d3c3` | `#263f70` | decorative dividers only (no contrast requirement)   |
| `--border-strong` | `#7d7f92` | `#7189b4` | input / control boundary: 3.38 / 4.46 (UI)           |
| `--text`          | `#0d2149` | `#f9ebe0` | every surface and soft tone: 12.50 / 10.10           |
| `--text-muted`    | `#475169` | `#c1c6d4` | canvas, surfaces, code, brand-soft: 6.28 / 6.90      |
| `--brand`         | `#208aae` | `#3fb3d9` | canvas, surface, surface-muted: 3.13 / 5.48 (UI)     |
| `--brand-strong`  | `#13617d` | `#7acfea` | canvas, surfaces, brand-soft: 5.49 / 6.70            |
| `--brand-soft`    | `#ddeff5` | `#103a5c` | selected / active backgrounds                        |
| `--focus`         | `#208aae` | `#5cc4e4` | canvas, surfaces, code, brand-soft: 3.13 / 5.88 (UI) |
| `--primary`       | `#0d2149` | `#7acfea` | primary button background                            |
| `--primary-hover` | `#1b3366` | `#a1ddf0` | primary button hover                                 |
| `--on-primary`    | `#fffcf9` | `#0d2149` | on primary / hover: 12.00 / 8.97                     |
| `--on-status`     | `#fff`    | `#071530` | on success / error fills: 7.00 / 9.12                |
| `--success`       | `#1a6638` | `#74d79c` | success-soft, surface, canvas, code: 5.98 / 7.09     |
| `--error`         | `#a3261e` | `#ff9e94` | error-soft, surface, canvas, code: 6.01 / 7.46       |
| `--warn`          | `#7f4500` | `#f2c06b` | warn-soft, surface, canvas, code: 6.42 / 7.92        |
| `--*-soft`        | see css   | see css   | tinted backgrounds for the tone above                |
| `--syntax-*`      | 8 tokens  | 8 tokens  | Prism token colours on `--code-bg`: 5.49 / 7.38      |

Headline pairs: navy on cream **13.52:1**, text on surface **15.44:1** (light) / **13.52:1** (dark), primary button
**15.44:1** (light) / **8.97:1** (dark).

### Tailwind classes

| Class                                                      | Use                                            |
| ---------------------------------------------------------- | ---------------------------------------------- |
| `bg-canvas`, `bg-surface`, `bg-surface-muted`, `bg-code`   | Backgrounds                                    |
| `border-line` / `border-line-strong`                       | Decorative dividers / form-control boundaries  |
| `text-text-main` / `text-text-muted`                       | Body / secondary text                          |
| `text-brand-strong`                                        | Links, active nav and tab labels, brand text   |
| `bg-brand`, `border-brand`, `outline-focus`                | Fills, selected borders, focus (non-text only) |
| `bg-brand-soft`                                            | Selected / active background                   |
| `bg-primary text-on-primary hover:bg-primary-hover`        | Primary action                                 |
| `success` / `error` / `warn` (+ `-soft`), `text-on-status` | Verdicts, difficulty, status badges            |
| `font-sans` (Inter, self-hosted) / `font-mono` (system)    | Text / code                                    |

### Token rules

- No raw hex colours or primitive palette classes (`text-slate-900`, `bg-white`) in components.
- Never put `text-brand` on text. Use `text-brand-strong`; `brand` is for borders, fills, icons and focus.
- Text colour must come from a pair the contrast script checks. A new background or text token needs new entries in
  `PAIRS` in `scripts/check-contrast.js` (both themes are checked automatically).
- Don't lower contrast with opacity on text (`opacity-60`, `text-text-muted/50`). Disabled controls are exempt.
- Status is never colour-only: pair it with an icon, a label, or `sr-only` text.
- Spacing and radius come from Tailwind's scale. Cards are `rounded-xl`, controls `rounded-lg`.
- Animate only `transform`, `opacity` and colours. `prefers-reduced-motion` collapses all transitions and animations
  globally (`src/index.css`).

## Folder pattern

Every component, question view and page lives in its own folder:

```
src/ui/<Component>/
  index.ts              re-exports the public API
  <Component>.tsx       the component (≤ 250 lines; split helpers into sibling files)
  <Component>.test.tsx  React Testing Library tests (jsdom)
```

```
src/
  ui/          design library; import from '../../ui' (src/ui/index.ts barrel)
    lib/       cn(), TONES, MOD, useNow(), useHydrated(), rovingIndex()/focusItem()
    Badge/ Button/ Callout/ Card/ Chips/ CodeBlock/ CodeEditor/ EmptyState/ IconButton/
    icons/ Kbd/ Layout/ LivePreview/ Page/ ProgressBar/ Prose/ ResultHeader/ Stat/ StatusDot/ Tabs/
  questions/   one folder per view + shared/ (useFirstVerdict, useShortcuts, useDraft, confirmReveal, AnswerDisclosure)
    registry.tsx
  pages/       Dashboard/ MockSetup/ QuestionPage/ Review/ SessionSummary/ SubjectPage/ Verify/
  test/        setup.ts (jest-dom, cleanup, Monaco stub), render.tsx (router helper)
```

Grouped folders: `Card` (Card, List), `Badge` (Badge, DifficultyBadge), `Page` (Page, PageHeader, SectionTitle),
`Chips` (Chips, ToggleChips), `Tabs` (Tabs, TabPanel).

### Components

| Component                                        | Purpose                                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `Page`, `PageHeader`, `SectionTitle`             | Page width (`narrow` / `default` / `wide`), h1 + description + actions, h2 section labels     |
| `Card`, `List`                                   | Surfaces; `List` adds dividers and takes an accessible `label`                                |
| `Button`, `buttonClass()`, `IconButton`          | `primary`, `secondary`, `ghost`, `success`, `danger` × `sm` / `md`; `buttonClass` for `Link`s |
| `Badge`, `DifficultyBadge`                       | Small labels with a `tone`                                                                    |
| `Callout`, `ResultHeader`                        | Explanation / verdict panels (`role="status"` when they appear after an action)               |
| `ProgressBar`, `StatusDot`, `Stat`, `EmptyState` | Progress and status, all labelled for assistive tech                                          |
| `Tabs` + `TabPanel`                              | WAI-ARIA tabs: one tab stop, arrows / Home / End, linked panel                                |
| `Chips` / `ToggleChips`                          | Single choice (radio group, roving focus) / multi-select (`aria-pressed`)                     |
| `Kbd`                                            | Keyboard hints                                                                                |
| `CodeBlock`                                      | Prism-highlighted code coloured by `--syntax-*` tokens                                        |
| `Prose` / `inline()`                             | Markdown-lite: paragraphs, `- ` bullets, tables, fences, `` `code` ``, `**bold**`             |
| `CodeEditor`                                     | Monaco with shared TS config and React type shim; Cmd/Ctrl+Enter runs `onRun`                 |
| `LivePreview`                                    | Sandboxed iframe for React (TSX, Tailwind v4, esm.sh imports) or plain HTML                   |
| `Layout`                                         | Skip link, banner + main navigation, `<main id="main-content">`                               |

Variants are plain maps (`BUTTON_VARIANTS`, `TONES`) combined with `cn()`; no class-variance libraries.

### Adding a component

1. Create `src/ui/<Name>/<Name>.tsx` using only semantic tokens; put variants in a `const` map keyed by variant name.
2. Add `src/ui/<Name>/index.ts` re-exporting it, and an `export * from './<Name>'` line in `src/ui/index.ts`.
3. Write `src/ui/<Name>/<Name>.test.tsx`: every variant, its ARIA attributes, and keyboard behaviour if interactive.
4. Inside `src/ui`, import siblings by folder (`../Card`), never through the barrel, to avoid cycles.
5. If it introduces a new colour pair, add it to `scripts/check-contrast.js` and run `npm run check:contrast`.

## Question views (`src/questions/`)

Each kind has one view that receives `{ q, subject, onResult }` and reports a verdict once through `useFirstVerdict`.
Register a new kind in `questions/registry.tsx` (label, plural, icon, blurb, view) and add its type to
`content/types.ts`. Every page (dashboard, subject filters, review, mock, verify) picks it up from there.
Explanations (`why`, flashcard backs, prompts) render through `Prose`, so they can use bullets and tables.

## Interaction conventions

- The first answer per visit is what counts for spaced repetition; retrying after seeing the answer never turns a miss into a pass.
- Revealing a solution before solving counts as a miss (with a confirmation). Each view also renders its answer and
  explanation in a collapsed `AnswerDisclosure` (`<details>`), so prerendered pages carry it for search engines;
  opening it is a reveal.
- Views must render the same markup on the server as on the first client pass: gate randomness (shuffles),
  `Date.now()` and browser APIs on `useHydrated()`, and give external stores a server snapshot.
- Every question view supports the keyboard: `1`–`n` / `Enter` for quizzes, `Space` and `1`/`2` for flashcards, `Cmd/Ctrl+Enter` to check or run.
- Moving to a question focuses its title, so keyboard and screen-reader users start at the question.
- Results scroll into view on narrow screens; layouts collapse to one column below `xl`.

## Accessibility checklist

- [ ] Text pairs ≥ 4.5:1, non-text UI (focus, state borders, control boundaries) ≥ 3:1: `npm run check:contrast`.
- [ ] Every interactive element shows the global teal `:focus-visible` ring (2px, 2px offset); never remove outlines.
- [ ] Landmarks: one `banner`, a labelled `navigation`, one `main`; the "Skip to content" link is the first tab stop.
- [ ] One `h1` per page; sections use `h2`/`h3` in order.
- [ ] Icon-only buttons have `aria-label` (use `IconButton`); decorative icons have `aria-hidden`.
- [ ] Form fields have a visible `<label>` (or `aria-labelledby`) and helper text via `aria-describedby`.
- [ ] Composite widgets follow WAI-ARIA patterns (`Tabs`, `Chips`): one tab stop, arrow keys, Home / End.
- [ ] Results that appear after an action are announced (`role="status"`, or `role="alert"` for errors).
- [ ] Status never relies on colour alone (icons, labels, `sr-only` text).
- [ ] No `autoFocus`; move focus deliberately (e.g. the question title on navigation).
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Tests query by role and accessible name, so broken semantics fail the suite.
