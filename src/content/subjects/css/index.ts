import { uiFiles } from '../../files';
import type { Subject } from '../../types';

const ui = uiFiles('css', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const css: Subject = {
  slug: 'css',
  title: 'CSS',
  blurb: 'Specificity, the box model, layout with flex and grid, units, architecture (BEM, OOCSS, SMACSS, utility-first), tooling, and GPU-friendly effects.',
  icon: 'palette',
  topics: [
    {
      slug: 'fundamentals',
      title: 'Cascade, box model & units',
      questions: [
        {
          kind: 'quiz',
          id: 'css-q1',
          title: 'Specificity',
          prompt: 'Which selector wins for the same property (no `!important`)?',
          code: `#nav .item a { color: red; }      /* A */
.nav .item:hover a { color: blue; } /* B */
nav ul li a { color: green; }       /* C */
a.link.active { color: purple; }    /* D */`,
          options: ['A', 'B', 'C', 'D'],
          answer: 0,
          why: 'Specificity is compared column by column as (ids, classes/attributes/pseudo-classes, elements), and A is the only selector with an id: A = (1,1,1), so it beats any number of classes. **Not B (0,3,1):** three class-level parts (`.nav`, `.item`, `:hover`) still lose to one id. **Not C (0,0,4):** four element selectors never outrank even one class. **Not D (0,2,1):** two classes on the `a` are still zero ids. Source order only decides an exact tie; inline styles beat all selectors and `!important` beats both.',
        },
        {
          kind: 'quiz',
          id: 'css-q2',
          title: 'box-sizing',
          prompt: 'With `width: 200px; padding: 20px; border: 5px solid`, how wide is the box under `content-box` vs `border-box`?',
          options: ['250px vs 200px', '200px vs 250px', '200px vs 200px', '240px vs 200px'],
          answer: 0,
          why: '`content-box` (the default) treats `width` as the content only, so padding and border are added on top: 200 + 2×20 + 2×5 = 250; `border-box` fits padding and border inside the 200. **Not 200px vs 250px:** that swaps the two models. **Not 200px vs 200px:** only `border-box` keeps the declared width. **Not 240px vs 200px:** that counts the padding but forgets the 10px of border. This is why resets set `*, *::before, *::after { box-sizing: border-box }`.',
        },
        {
          kind: 'quiz',
          id: 'css-q3',
          title: 'rem vs em',
          prompt:
            'Root font-size is 16px. A `.parent { font-size: 1.5em }` sits inside a `24px` container. What is `.child { font-size: 1.5em }` inside `.parent`, and what would `1.5rem` be?',
          options: ['54px vs 24px', '36px vs 24px', '24px vs 24px', '54px vs 36px'],
          answer: 0,
          why: "`em` on `font-size` is relative to the parent's font-size and compounds: `.parent` = 24 × 1.5 = 36, `.child` = 36 × 1.5 = 54. `rem` always uses the root: 16 × 1.5 = 24. **Not 36px vs 24px:** 36 is `.parent`, it forgets the second multiplication. **Not 24px vs 24px:** that treats `em` like `rem`. **Not 54px vs 36px:** `rem` ignores the parent chain entirely, so it cannot be 36. Use rem for a consistent type scale, em for things that should scale with their component.",
        },
        {
          kind: 'quiz',
          id: 'css-q4',
          title: 'Stacking contexts',
          prompt: 'A modal has `z-index: 9999` but appears UNDER a header with `z-index: 10`. What is the likely cause?',
          options: [
            'The modal is inside a parent that creates its own stacking context (e.g. `transform`, `opacity < 1`, or `position` + `z-index`), and that parent sits below the header',
            'z-index only works on flex items',
            'z-index max is 1000',
            'The header uses `position: sticky`',
          ],
          answer: 0,
          why: "`z-index` only competes within the same stacking context; an ancestor with `transform`, `opacity < 1`, `filter`, or positioned + `z-index` traps its children at the ancestor's own level, so 9999 inside a low context still loses to 10 outside. **Not flex items only:** z-index works on positioned elements and on flex/grid items. **Not a max of 1000:** there is no such cap (it is a 32-bit integer). **Not sticky:** sticky is just another positioned value and doesn't beat a higher z-index on its own. Fix: portal the modal to `<body>` or use the `<dialog>` top layer.",
        },
        {
          kind: 'quiz',
          id: 'css-q5',
          title: 'flex vs inline-flex',
          prompt: 'What is the difference between `display: flex` and `display: inline-flex`?',
          options: [
            'Both lay out children with flexbox; flex makes the container block-level (full width), inline-flex makes it inline-level (content width, sits in text)',
            'inline-flex disables wrapping',
            'inline-flex lays children out vertically',
            'There is no difference',
          ],
          answer: 0,
          why: "`display` has an outer type (block vs inline: how the box sits among siblings) and an inner type (flex: how it lays out children); `flex` is block-level, `inline-flex` is inline-level, the children behave identically. **Not disables wrapping:** `flex-wrap` works the same on both. **Not vertical:** direction comes from `flex-direction`, not the outer type. **Not no difference:** the container's own width and flow differ. Same story for `grid` vs `inline-grid`.",
        },
        {
          kind: 'flashcard',
          id: 'css-f1',
          title: 'position values',
          front: 'Explain static, relative, absolute, fixed and sticky.',
          back: `- **static**: normal flow; top/left/z-index are ignored.
- **relative**: normal flow, then nudged by top/left; becomes the **containing block** for absolute children.
- **absolute**: removed from flow; positioned against the nearest positioned ancestor.
- **fixed**: removed from flow; positioned against the viewport (unless an ancestor has transform/filter, which traps it).
- **sticky**: flows normally until it hits its top/left threshold within its scroll container, then sticks. Needs a threshold and an overflow-free ancestor.`,
        },
        {
          kind: 'flashcard',
          id: 'css-f2',
          title: 'Flexbox vs Grid',
          front: 'When do you reach for flexbox and when for grid?',
          back: `**Flexbox** is one-dimensional and **content-out**: items size themselves and you distribute leftover space along one axis. Good for navbars, toolbars, centering, and pushing something to the end (\`margin-left: auto\`).

**Grid** is two-dimensional and **layout-in**: you define rows/columns and place items. Good for page layouts (\`grid-template-areas\`), card galleries (\`repeat(auto-fill, minmax(...))\`), and anything that must align across rows. They compose: grid for the page, flex inside the cards.`,
        },
      ],
    },
    {
      slug: 'architecture',
      title: 'Architecture & tooling',
      questions: [
        {
          kind: 'quiz',
          id: 'arch-q1',
          title: 'Reading BEM',
          prompt: 'In BEM, what is `product-card__title--featured`?',
          options: [
            'Block `product-card`, element `title`, modifier `featured`',
            'Block `title`, element `product-card`, modifier `featured`',
            'Three separate classes',
            'A SMACSS state class',
          ],
          answer: 0,
          why: 'BEM reads Block `__element` `--modifier`, so `product-card` is the block, `title` an element inside it, `featured` a variant. **Not block title:** the block always comes first, before `__`. **Not three classes:** it is one flat class name, which is the point (single-class selectors keep specificity low). **Not SMACSS state:** SMACSS states look like `.is-active`, not `--modifier`.',
        },
        {
          kind: 'quiz',
          id: 'arch-q2',
          title: 'Which methodology?',
          prompt: 'Match: "separate structure from skin" · "five categories: base, layout, module, state, theme" · "one class per property".',
          options: ['OOCSS · SMACSS · Utility-first', 'BEM · OOCSS · SMACSS', 'SMACSS · BEM · OOCSS', 'Utility-first · SMACSS · BEM'],
          answer: 0,
          why: "OOCSS separates structure (`.btn`) from skin (`.btn-primary`); SMACSS sorts rules into base, layout, module, state, theme; utility-first (Tailwind) is one class per property composed in markup. **Not BEM · OOCSS · SMACSS:** BEM is a naming convention, not structure vs skin. **Not SMACSS · BEM · OOCSS:** BEM has no five categories. **Not Utility-first · SMACSS · BEM:** utility-first doesn't talk about structure vs skin, and BEM isn't one class per property.",
        },
        {
          kind: 'quiz',
          id: 'arch-q3',
          title: 'Pre- vs post-processors',
          prompt: 'Which of these is a POSTprocessor job?',
          options: [
            'Adding vendor prefixes (Autoprefixer) and minifying (cssnano)',
            'Variables and mixins in SCSS',
            'Nesting selectors in Less',
            'Functions in Stylus',
          ],
          answer: 0,
          why: 'A postprocessor transforms CSS that already exists, and Autoprefixer (adds vendor prefixes) and cssnano (minifies) are PostCSS plugins doing exactly that. **Not SCSS variables/mixins, Less nesting, Stylus functions:** all three are authoring features of preprocessors that compile a nicer language into CSS. Tailwind v4 is its own compiler and uses Lightning CSS for prefixing and minifying.',
        },
        {
          kind: 'flashcard',
          id: 'arch-f1',
          title: 'Design tokens',
          front: 'What are semantic design tokens, and why do they make dark mode easy?',
          back: `Tokens are named design decisions: colours, spacing, radii. **Primitive** tokens name raw values (\`slate-900\`); **semantic** tokens name intent (\`text-main\`, \`surface\`, \`brand\`).

Components only use semantic tokens (as CSS variables). Dark mode then becomes one block that remaps the variables (\`.dark { --surface: #171a20 }\`), with no per-component changes. This app is built exactly that way.`,
        },
      ],
    },
    {
      slug: 'effects-performance',
      title: 'Effects, animation & performance',
      questions: [
        {
          kind: 'quiz',
          id: 'fx-q1',
          title: 'Why animate transform',
          prompt: 'Why animate `transform: translateX()` instead of `left`?',
          options: [
            'transform can be handled by the compositor on the GPU (no layout or paint per frame); left triggers layout every frame',
            'left is deprecated',
            'transform works without position',
            'Browsers cap left animations at 30fps',
          ],
          answer: 0,
          why: '`transform` (and `opacity`) can be animated on a compositor layer by the GPU with no layout or paint per frame, while `left` changes geometry and forces layout + paint every frame, which janks. **Not deprecated:** `left` is perfectly valid. **Not works without position:** true, but irrelevant to smoothness. **Not a 30fps cap:** browsers cap nothing; it just drops frames when layout is expensive. `will-change: transform` promotes a layer ahead of time (sparingly, layers cost memory).',
        },
        {
          kind: 'quiz',
          id: 'fx-q2',
          title: 'clip-path vs mask-image',
          prompt: 'You want text to fade softly to transparent at the bottom. Which property?',
          options: [
            '`mask-image: linear-gradient(to bottom, black 50%, transparent)`',
            '`clip-path: inset(0 0 50% 0)`',
            '`opacity: 0.5`',
            '`overflow: hidden`',
          ],
          answer: 0,
          why: '`mask-image` uses an image or gradient as an alpha channel, so a gradient to `transparent` gives a soft fade. **Not clip-path:** it makes hard vector cuts, pixels are fully in or out. **Not opacity: 0.5:** it fades the whole element uniformly, not just the bottom. **Not overflow: hidden:** it hard-crops overflowing content with no fade.',
        },
        {
          kind: 'quiz',
          id: 'fx-q3',
          title: 'Responsive images',
          prompt: 'Which markup lets the browser download a smaller image on small screens?',
          options: [
            '`<img src="m.jpg" srcset="s.jpg 480w, m.jpg 960w, l.jpg 1600w" sizes="(max-width: 600px) 100vw, 50vw" alt="…">`',
            '`<img src="l.jpg" style="max-width:100%">`',
            '`<img src="l.jpg" loading="lazy">`',
            'Hide the image with a media query',
          ],
          answer: 0,
          why: '`srcset` lists candidate files with their intrinsic widths and `sizes` says how wide the image will render, so the browser picks the smallest adequate file for the viewport and pixel density. **Not max-width: 100%:** it only scales the big download down visually. **Not loading=lazy:** it defers the request but still fetches the big file. **Not hiding with a media query:** a hidden `<img>` is usually still downloaded. `<picture>` + `<source media>` is for art direction (different crops).',
        },
        {
          kind: 'ui',
          id: 'grid-layout',
          title: 'Responsive page layout with grid areas',
          difficulty: 'easy',
          framework: 'vanilla',
          prompt:
            'Lay out a header, sidebar, main content and widgets area with CSS Grid, then make it collapse to one column on mobile without changing the HTML.',
          requirements: [
            'Desktop: header across the top; sidebar on the left spanning two rows; content and widgets on the right',
            'Uses `grid-template-areas` (readable) instead of line numbers',
            'Sidebar column is 250px; the content column takes the rest (`1fr`)',
            'Below 768px: a single column ordered header → content → widgets → sidebar, changed only in CSS',
            'Uses `min-height` rather than `height` so content can grow',
          ],
          ...ui('grid-layout'),
        },
        {
          kind: 'ui',
          id: 'card-grid',
          title: 'Responsive card grid (no media queries)',
          difficulty: 'easy',
          framework: 'vanilla',
          prompt: 'Turn the list into a responsive card gallery that adds or removes columns automatically, with equal-height cards in each row.',
          requirements: [
            'Columns are at least 220px and fill the row, using `repeat(auto-fill, minmax(…, 1fr))`',
            'No media queries, and no horizontal scroll on narrow screens (hint: `min(220px, 100%)`)',
            'Cards in a row are the same height',
            'The "Read" link sits at the bottom of every card regardless of text length',
            'Each "Read" link has a distinct accessible name (e.g. visually hidden "about …" text), not five identical "Read" links',
            "It's still a semantic list (`ul`/`li`) for screen readers",
          ],
          ...ui('card-grid'),
        },
        {
          kind: 'ui',
          id: 'clip-path-shapes',
          title: 'Shapes with clip-path',
          difficulty: 'easy',
          framework: 'vanilla',
          prompt: 'Turn the five purple squares into a circle, triangle, hexagon, parallelogram and star using only CSS, then add a GPU-friendly hover effect.',
          requirements: [
            'Circle, triangle, hexagon, parallelogram and star are made with `clip-path`',
            'Hover rotates/scales the shape using `transform` (not width/top)',
            'Motion is disabled under `prefers-reduced-motion: reduce`',
            'Bonus: one extra shape that fades out softly with `mask-image`',
          ],
          ...ui('clip-path-shapes'),
        },
      ],
    },
  ],
};
