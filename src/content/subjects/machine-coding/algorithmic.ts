import { uiFiles } from '../../files';
import type { Topic } from '../../types';

const ui = uiFiles('machine-coding', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const algorithmic: Topic = {
  slug: 'algorithmic',
  title: 'Algorithmic UIs (React)',
  questions: [
    {
      kind: 'ui',
      id: 'imperative-handle',
      title: 'useImperativeHandle input',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Build a custom input that exposes `focus()`, `clear()` and `shake()` to its parent through a ref, and buttons in the parent that call them.',
      requirements: [
        'The child receives a ref (React 19: as a prop; older: `forwardRef`)',
        '`useImperativeHandle` exposes ONLY focus, clear and shake, not the raw DOM node',
        'Shake triggers a short CSS animation',
        "The parent never touches the input's DOM directly",
        'Explain why this hook should be used sparingly',
      ],
      ...ui('imperative-handle'),
    },
    {
      kind: 'ui',
      id: 'folder-tree',
      title: 'File explorer tree',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Render a nested folder structure where folders expand and collapse, recursively.',
      requirements: [
        'A recursive component renders folders and files at any depth',
        'Folders toggle open and closed; files show an icon by extension',
        'Indentation reflects depth',
        'Bonus: add a file or folder inside any folder (immutable tree update)',
        'Folders are buttons with `aria-expanded`',
      ],
      ...ui('folder-tree'),
    },
    {
      kind: 'ui',
      id: 'calendar-day',
      title: 'Calendar day view with overlapping events',
      difficulty: 'hard',
      framework: 'react',
      prompt: 'Render a day planner (24 hours) and position events by time; overlapping events must not hide each other.',
      requirements: [
        'Convert HH:mm to minutes; top = start minute, height = duration (1 minute = 1px)',
        'Overlapping events are shifted right so each stays visible: put each event in the first column that is free when it starts',
        'Hour lines and labels are drawn for the whole day',
        'Each event shows its title and time range',
        'Bonus: split the width evenly between the events that overlap',
      ],
      ...ui('calendar-day'),
    },
    {
      kind: 'ui',
      id: 'snake-and-ladder',
      title: 'Snake and ladder',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Two-player snake and ladder on a 10×10 board using the given snakes and ladders.',
      requirements: [
        'Positions live in state; a roll moves the current player 1–6',
        'Landing on a snake head or ladder foot jumps to its end',
        "You can't overshoot 100; reaching exactly 100 wins",
        'The board renders in boustrophedon order (rows alternate direction)',
        'Snakes, ladders and player tokens are visible; Reset restarts',
      ],
      ...ui('snake-and-ladder'),
    },
    {
      kind: 'ui',
      id: 'virtual-dom',
      title: 'Render a virtual DOM',
      difficulty: 'medium',
      framework: 'react',
      prompt: 'Write `virtualToReal(node)`, which turns a JSON tree (`{ type, props, children }`) into real DOM nodes, and render the result into a container.',
      requirements: [
        'Strings and numbers become text nodes',
        'Elements are created with `document.createElement(type)`',
        'Props are applied as attributes (`className` → `class`)',
        'Children are processed recursively and appended',
        'The container is cleared before re-rendering (in an effect, via a ref)',
      ],
      ...ui('virtual-dom'),
    },
  ],
};
