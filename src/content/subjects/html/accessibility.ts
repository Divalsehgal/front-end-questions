import { uiFiles } from '../../files';
import type { Topic } from '../../types';

const ui = uiFiles('html', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const accessibility: Topic = {
  slug: 'accessibility',
  title: 'Accessibility & ARIA',
  questions: [
    {
      kind: 'quiz',
      id: 'a11y-q1',
      title: 'Linking a hint to an input',
      prompt: 'An input has helper text below it ("At least 8 characters"). How do you make screen readers announce it with the input?',
      options: [
        '`aria-describedby="hint-id"` on the input',
        '`aria-label` on the hint',
        '`aria-controls="hint-id"` on the input',
        'Put the hint inside the `<label>` with `display: none`',
      ],
      answer: 0,
      why: "`aria-describedby` on the input points at the hint, so screen readers announce it as the input's description after its name. **Not aria-label on the hint:** that names the hint element, it doesn't connect it to the input. **Not aria-controls:** means 'this element controls that one' (accordion button to panel), not 'describes'. **Not hidden in the label:** `display: none` content is removed from the accessibility tree, so it isn't read.",
    },
    {
      kind: 'quiz',
      id: 'a11y-q2',
      title: 'Naming a dialog',
      prompt: 'What is the cleanest way to give a modal dialog its accessible name when it already has a visible `<h2>`?',
      options: [
        "`aria-labelledby` pointing at the `<h2>`'s id",
        'A visually hidden duplicate label',
        '`title="..."` on the dialog',
        '`role="heading"` on the dialog',
      ],
      answer: 0,
      why: "`aria-labelledby` reuses the visible `<h2>` as the dialog's name, so it can never drift from what sighted users see; add `aria-describedby` for the body text. **Not a hidden duplicate label:** duplicate text drifts out of sync. **Not title:** unreliably announced and shows a hover tooltip. **Not role=heading on the dialog:** replaces the dialog role, it doesn't name it.",
    },
    {
      kind: 'quiz',
      id: 'a11y-q3',
      title: 'tabindex values',
      prompt: 'Which use of `tabindex` is correct?',
      options: [
        '`tabindex="0"` adds a custom control to the natural Tab order; `tabindex="-1"` makes it focusable only from script',
        '`tabindex="5"` is the best way to fix a confusing focus order',
        '`tabindex="-1"` removes an element from the accessibility tree',
        'Buttons need `tabindex="0"` to be focusable',
      ],
      answer: 0,
      why: "`tabindex=\"0\"` puts a custom control into the natural Tab order (DOM order), and `-1` makes it focusable only via `.focus()` (dialogs, roving tabindex, skip-link targets). **Not tabindex=5:** positive values create a separate, fragile order that jumps ahead of everything; fix the DOM order instead. **Not '-1 removes from the a11y tree':** it only removes it from Tab order; `aria-hidden` removes from the tree. **Not 'buttons need 0':** native buttons, links and inputs are already focusable.",
    },
    {
      kind: 'quiz',
      id: 'a11y-q4',
      title: 'Announcing a toast',
      prompt: 'A script shows "Saved!" in a toast. Sighted users see it; screen-reader users hear nothing. Fix?',
      options: [
        'Render toasts inside a container with `aria-live="polite"` (or `role="status"`) that exists before the message is inserted',
        'Give the toast `tabindex="0"` and focus it',
        'Use `alert()` instead',
        'Add `aria-hidden="false"`',
      ],
      answer: 0,
      why: 'A live region (`aria-live="polite"` or `role="status"`) makes screen readers announce content changes inside it, and it must already exist in the DOM before the text is inserted or the change isn\'t noticed. **Not focusing the toast:** steals focus and disrupts what the user was doing. **Not alert():** blocks the page and is a jarring modal for a success message. **Not aria-hidden=false:** a no-op, the toast was never hidden from the a11y tree, it just wasn\'t announced.',
    },
    {
      kind: 'quiz',
      id: 'a11y-q5',
      title: 'aria-hidden vs .sr-only',
      prompt: 'Match the intent: hide a decorative SVG icon from screen readers, and add "(opens in new tab)" text only for screen readers.',
      options: [
        'Icon: `aria-hidden="true"` · Text: a `.sr-only` visually-hidden class',
        'Icon: `.sr-only` · Text: `aria-hidden="true"`',
        'Both: `display: none`',
        'Icon: `role="presentation"` on the text · Text: `alt=""`',
      ],
      answer: 0,
      why: "`aria-hidden=\"true\"` removes the icon from the accessibility tree while it stays visible, and `.sr-only` (clip + 1px box) hides text visually while keeping it readable. **Not the swapped pairing:** that would announce the icon and hide the extra text from the people who need it. **Not display: none for both:** hides from everyone, so the 'opens in new tab' text is never read. **Not role=presentation / alt='':** those apply to images and semantics, and `alt=''` on text does nothing.",
    },
    {
      kind: 'quiz',
      id: 'a11y-q6',
      title: 'First rule of ARIA',
      prompt: 'You need a clickable control. Which is best?',
      options: ['`<button type="button">`', '`<div role="button" tabindex="0">` with click AND Enter/Space key handlers', '`<div onclick>`', '`<a href="#">`'],
      answer: 0,
      why: 'First rule of ARIA: use the native element. `<button type="button">` brings focus, Enter/Space activation, the button role and disabled state for free. **Not div role=button tabindex=0 + key handlers:** it works, but you rebuild everything by hand and miss details (disabled, form behaviour). **Not div onclick:** not focusable, no role, mouse-only. **Not a href=#:** a link means navigation, activates only on Enter, and jumps to the top unless prevented.',
    },
    {
      kind: 'flashcard',
      id: 'a11y-f1',
      title: 'Reduced motion',
      front: 'How do you respect users who get motion sickness from animations?',
      back: `Use the \`prefers-reduced-motion\` media query. Either opt IN to motion:

\`\`\`
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
\`\`\`

or tone it down under \`(prefers-reduced-motion: reduce)\` (shorter or no transitions, no parallax or auto-playing carousels). In JS: \`matchMedia('(prefers-reduced-motion: reduce)').matches\`.`,
    },
    {
      kind: 'flashcard',
      id: 'a11y-f2',
      title: 'Keyboard patterns',
      front: 'What keyboard behaviour do users expect from tabs, menus and dialogs?',
      back: `- **Tabs**: Tab moves INTO the tablist once (roving tabindex); ←/→ (and Home/End) switch tabs; Tab moves on to the panel.
- **Menus/listboxes**: ↑/↓ move, Enter/Space select, Esc closes and returns focus to the trigger.
- **Dialogs**: focus moves inside on open, Tab is **trapped** inside, Esc closes, focus **returns** to the opener. Native \`<dialog>.showModal()\` does most of this.

The source of truth is the WAI-ARIA Authoring Practices Guide (APG).`,
    },
    {
      kind: 'quiz',
      id: 'a11y-q8',
      title: 'Landmarks and popups',
      prompt: 'Which statements about landmarks and popup buttons are true?',
      options: [
        'Prefer `<main>`, `<nav>`, `<header>`; `role="main"/"navigation"/"banner"/"search"` are fallbacks when you can\'t use them',
        'A `<section>` (or `role="region"`) becomes a landmark only when it has an accessible name, e.g. `aria-labelledby` its heading',
        'A button that opens a menu or listbox can say so with `aria-haspopup="menu"` / `"listbox"` and `aria-expanded`',
        'Every `<div>` should get a role',
      ],
      answer: [0, 1, 2],
      why: 'Native `<main>`, `<nav>`, `<header>` map to landmarks automatically, with roles as a fallback; a `<section>` is a region landmark only when it has an accessible name; and `aria-haspopup` + `aria-expanded` tell users a button opens a menu or listbox and whether it is open. **Not a role on every div:** plain containers have no meaning to convey, and extra roles add noise that makes landmark navigation worse.',
    },
    {
      kind: 'quiz',
      id: 'a11y-q7',
      title: 'A custom toggle switch',
      prompt: 'You build a toggle switch from a `<button>` styled as a pill. What makes it accessible?',
      options: [
        '`role="switch"` with `aria-checked` kept in sync, plus a visible or `aria-label` name',
        '`aria-pressed` on a div with no tabindex',
        'Only the visual on/off colour change',
        '`role="checkbox"` on a span with a click handler',
      ],
      answer: 0,
      why: '`role="switch"` announces an on/off control, `aria-checked` must reflect the current state, and it needs a name; building it on a real `<button>` gives focus and Enter/Space for free. **Not aria-pressed on a div without tabindex:** can\'t be reached by keyboard. **Not colour alone:** invisible to screen readers and fails users with colour-vision deficiencies. **Not role=checkbox on a span with click:** not focusable and no keyboard activation.',
    },
    {
      kind: 'ui',
      id: 'a11y-accordion',
      title: 'Build an accessible accordion',
      difficulty: 'easy',
      framework: 'vanilla',
      prompt:
        'Build an FAQ accordion with three sections that works for keyboard and screen-reader users, using semantic HTML and as little ARIA as necessary.',
      requirements: [
        'Each header is a real `<button>` inside a heading element',
        'The button has `aria-expanded` that stays in sync, and `aria-controls` pointing at its panel',
        'Collapsed panels are removed from the accessibility tree (`hidden`), not just visually shrunk',
        'Enter and Space toggle (built into a button); there is a visible focus style',
        'One event listener handles all headers (event delegation)',
        'Animations are disabled under `prefers-reduced-motion: reduce`',
      ],
      ...ui('a11y-accordion'),
    },
    {
      kind: 'ui',
      id: 'a11y-tabs',
      title: 'Build accessible tabs',
      difficulty: 'medium',
      framework: 'vanilla',
      prompt: 'Build a three-tab widget (Profile, Security, Billing) following the WAI-ARIA tabs pattern.',
      requirements: [
        '`role="tablist"` with a label; each tab has `role="tab"`, `aria-selected` and `aria-controls`',
        'Each panel has `role="tabpanel"` and `aria-labelledby` its tab; inactive panels are `hidden`',
        'Roving tabindex: only the selected tab has `tabindex="0"`; the others have `-1`',
        '←/→ arrow keys move to and activate the previous/next tab, wrapping around; Home/End jump to the ends',
        'Clicking a tab works too',
      ],
      ...ui('a11y-tabs'),
    },
    {
      kind: 'ui',
      id: 'a11y-modal',
      title: 'Build an accessible confirmation modal',
      difficulty: 'medium',
      framework: 'vanilla',
      prompt: 'Clicking "Delete account" opens a confirmation dialog with Cancel and "Yes, delete". Show the result in a status message.',
      requirements: [
        'The dialog has an accessible name (`aria-labelledby` its heading) and description',
        "Focus moves into the dialog on open, and Tab cannot leave it while it's open",
        'Esc closes it; clicking the backdrop closes it',
        'Focus returns to the "Delete account" button when it closes',
        "The page behind is inert while it's open (hint: native `<dialog>` + `showModal()`)",
        'The outcome is announced through a `role="status"` region',
      ],
      ...ui('a11y-modal'),
    },
    {
      kind: 'ui',
      id: 'live-toast',
      title: 'Build announced toasts',
      difficulty: 'easy',
      framework: 'vanilla',
      prompt: '"Save" shows a success toast; "Trigger error" shows an error toast. Both auto-dismiss after 4 seconds and must be announced by screen readers.',
      requirements: [
        'Toasts render inside live regions that already exist in the DOM on page load',
        'Success uses a polite region; errors use an assertive one (`role="alert"`)',
        'Multiple toasts stack instead of replacing each other',
        'Each toast removes itself after 4 seconds',
        'Toast text is set with `textContent`, never `innerHTML` (XSS)',
      ],
      ...ui('live-toast'),
    },
  ],
};
