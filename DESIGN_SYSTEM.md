# Design system

Every screen is built from the same tokens and components, so new question types and pages look consistent, support
dark mode without extra work, and meet **WCAG 2.2 AA**. Styling is Tailwind v4; tokens are exposed to it through
`@theme` in `src/index.css`.

## Palette

Three colours on slate neutrals, each with one job. Status colours (success / error / warn) only ever mean state.

| Colour | Light     | Dark      | Job                                                                      |
| ------ | --------- | --------- | ------------------------------------------------------------------------ |
| Ink    | `#0f172a` | `#e6e9f2` | Text and surfaces (slate)                                                |
| Violet | `#6e56cf` | `#a18cff` | Brand: primary buttons, links, active nav, selection, focus ring         |
| Cyan   | `#0891b2` | `#22d3ee` | Secondary: progress fills (violet→cyan gradient), stat icons, highlights |

Violet and cyan pass 3:1 for non-text UI; coloured text uses the **`-strong`** variants (`--brand-strong`,
`--secondary-strong`). Numbers, counts, badges and section labels use the system monospace font; everything else is
Inter. A faint grid sits behind the top of the canvas (`body::before`, colour `--grid`) and fades out.

### Tokens and measured contrast

Ratios are WCAG 2.x relative-luminance contrast, measured by `npm run check:contrast` (the same check runs in CI as
`src/test/contrast.test.ts`). Text pairs need ≥ 4.5:1, non-text UI pairs ≥ 3:1.

| Token                | Light     | Dark      | Checked against (lowest ratio light / dark)          |
| -------------------- | --------- | --------- | ---------------------------------------------------- |
| `--canvas`           | `#f8fafc` | `#0b1020` | app background                                       |
| `--surface`          | `#fff`    | `#11172a` | cards, sidebar                                       |
| `--surface-muted`    | `#f1f5f9` | `#1a2238` | hover rows, inline code, tracks                      |
| `--code-bg`          | `#f6f8fb` | `#0d1324` | code blocks, answer box                              |
| `--border`           | `#e2e8f0` | `#232c45` | decorative dividers only (no contrast requirement)   |
| `--border-strong`    | `#7d8899` | `#5f6b8b` | input / control boundary: 3.37 / 3.36 (UI)           |
| `--text`             | `#0f172a` | `#e6e9f2` | every surface and soft tone: 15.56 / 12.40           |
| `--text-muted`       | `#526075` | `#9aa4bd` | canvas, surfaces, code, soft tones: 5.56 / 6.29      |
| `--brand`            | `#6e56cf` | `#a18cff` | canvas, surface, surface-muted: 4.92 / 5.80 (UI)     |
| `--brand-strong`     | `#5a3fc0` | `#bcaeff` | canvas, surfaces, brand-soft: 6.29 / 7.95            |
| `--brand-soft`       | `#f1edff` | `#231d47` | selected / active backgrounds                        |
| `--secondary`        | `#0891b2` | `#22d3ee` | canvas, surface, surface-muted: 3.36 / 8.74 (UI)     |
| `--secondary-strong` | `#0e7490` | `#67e8f9` | canvas, surfaces, secondary-soft: 4.89 / 10.38       |
| `--secondary-soft`   | `#e6f8fc` | `#0a2a35` | highlight backgrounds                                |
| `--focus`            | `#6e56cf` | `#a18cff` | canvas, surfaces, code, brand-soft: 4.70 / 5.76 (UI) |
| `--primary`          | `#6e56cf` | `#a18cff` | primary button background                            |
| `--primary-hover`    | `#5a3fc0` | `#b8a8ff` | primary button hover                                 |
| `--on-primary`       | `#fff`    | `#0b1020` | on primary / hover: 5.39 / 6.95                      |
| `--on-status`        | `#fff`    | `#0b1020` | on success / error fills: 5.41 / 6.84                |
| `--success`          | `#157a3c` | `#4ade80` | success-soft, surface, canvas, code: 5.04 / 9.43     |
| `--error`            | `#c0262d` | `#f87171` | error-soft, surface, canvas, code: 5.36 / 6.39       |
| `--warn`             | `#93510a` | `#fbbf24` | warn-soft, surface, canvas, code: 5.77 / 10.05       |
| `--*-soft`           | see css   | see css   | tinted backgrounds for the tone above                |
| `--syntax-*`         | 8 tokens  | 8 tokens  | Prism token colours on `--code-bg`: 4.67 / 5.78      |

Headline pairs: text on surface **17.85:1** (light) / **14.67:1** (dark).

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
- [ ] Every interactive element shows the global violet `:focus-visible` ring (2px, 2px offset); never remove outlines.
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
