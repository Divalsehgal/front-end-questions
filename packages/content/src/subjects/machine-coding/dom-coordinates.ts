import type { Topic } from '../../types';

export const domCoordinates: Topic = {
  slug: 'dom-coordinates',
  title: 'DOM geometry & images',
  questions: [
    {
      kind: 'quiz',
      id: 'dom-q1',
      title: 'clientX vs pageX vs offsetX',
      prompt: 'You position a tooltip with `position: absolute` at the click point on a scrolled page. Which mouse coordinates do you use?',
      options: [
        '`pageX/pageY` (document-relative, includes scroll)',
        '`clientX/clientY` (viewport-relative)',
        '`offsetX/offsetY` (relative to the event target)',
        '`screenX/screenY` (monitor)',
      ],
      answer: 0,
      why: 'An absolutely positioned tooltip is placed in document coordinates, so you need the scroll offset included: `pageX = clientX + scrollX`. **Not clientX/Y:** viewport-relative, so on a scrolled page the tooltip lands too high (it is right for `position: fixed`). **Not offsetX/Y:** relative to whichever child element was hit, so it jumps around. **Not screenX/Y:** relative to the physical monitor, unrelated to the page.',
    },
    {
      kind: 'quiz',
      id: 'dom-q2',
      title: 'offsetWidth vs clientWidth vs scrollWidth',
      prompt: 'A div has 10px borders and 20px padding. Which property includes the border?',
      options: ['`offsetWidth`', '`clientWidth`', '`scrollWidth`', '`clientLeft`'],
      answer: 0,
      why: "`offsetWidth` is the rendered box: content + padding + border (+ scrollbar). **Not clientWidth:** content + padding only, it excludes the border. **Not scrollWidth:** the full scrollable content width including overflow, also border-excluded. **Not clientLeft:** that is just the left border's thickness (10px), not the element's width.",
    },
    {
      kind: 'flashcard',
      id: 'dom-f1',
      title: 'Is it in the viewport?',
      front: 'How do you check whether an element is visible in the viewport, and what is the better modern approach?',
      back: `Manual check with \`getBoundingClientRect()\` (viewport-relative):

\`\`\`
const r = el.getBoundingClientRect();
const visible = r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
\`\`\`

But calling that on every scroll forces layout. Prefer **IntersectionObserver**: asynchronous, no layout thrash, with thresholds and rootMargin. It's the basis of lazy loading, infinite scroll and impression tracking.`,
    },
    {
      kind: 'flashcard',
      id: 'img-f1',
      title: 'srcset w vs x descriptors, and <picture>',
      front: 'When do you use `srcset` with x descriptors, with w descriptors, and `<picture>`?',
      back: `- **x descriptors** (\`img.jpg 1x, img@2x.jpg 2x\`): fixed-size images (icons, logos). The browser matches the device pixel ratio; no \`sizes\` needed.
- **w descriptors** (\`small.jpg 480w, large.jpg 1200w\`) + **sizes**: fluid images. The browser computes the layout width from \`sizes\`, multiplies by the DPR and picks the closest file. \`sizes\` is mandatory, or the browser assumes 100vw.
- **\`<picture>\` + \`<source media>\`**: **art direction** (a different crop per breakpoint). The first matching source wins; \`<img>\` is the fallback.`,
    },
    {
      kind: 'order',
      id: 'img-o1',
      title: 'How the browser loads a responsive image',
      prompt: 'Order what happens for an `<img>` with width/height, srcset and sizes.',
      items: [
        'Reserve space from the width/height aspect ratio (prevents layout shift)',
        "Evaluate `sizes` to predict the rendered width (CSS isn't loaded yet)",
        'Multiply by the device pixel ratio and pick the best `srcset` candidate',
        'Download (respecting `loading="lazy"` / `fetchpriority`)',
        'Decode and paint into the reserved box',
      ],
      why: 'The preload scanner fetches images before CSS arrives, so HTML attributes drive every decision. Missing width/height causes CLS; missing sizes makes the browser assume 100vw and over-download; lazy-loading the LCP image delays LCP.',
    },
  ],
};
