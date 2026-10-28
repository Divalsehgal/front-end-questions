import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('react', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const rendering: Topic = {
  slug: 'rendering',
  title: 'Rendering, reconciliation & Fiber',
  questions: [
    {
      kind: 'order',
      id: 'r-o1',
      title: 'From setState to pixels',
      prompt: 'A state update happens. Order what React and the browser do next.',
      items: [
        'Render phase: call components and diff the new tree (pure, interruptible)',
        'Commit, mutation: apply DOM changes',
        'Commit, layout: run `useLayoutEffect` callbacks',
        'Browser paints the frame',
        'Run `useEffect` callbacks',
      ],
      why: 'Render is pure and can be paused or thrown away (concurrent rendering). Commit is synchronous. Layout effects run before paint, so they can measure and fix layout without flicker; passive effects run after paint so they never block it.',
    },
    {
      kind: 'flashcard',
      id: 'r-f1',
      title: 'Render phase vs commit phase',
      front: 'What happens in the render phase and the commit phase, and which can be interrupted?',
      back: `**Render phase**: React calls your components, builds the new element tree and reconciles (diffs) it against the current one. It must be **pure**: no side effects, because React may pause, restart or discard it (StrictMode double-invokes it to catch impurity).

**Commit phase**: React applies the minimal DOM changes, attaches refs, then runs effects. It is **synchronous and can't be interrupted**: users never see a half-applied update.`,
    },
    {
      kind: 'flashcard',
      id: 'r-f2',
      title: 'What is Fiber?',
      front: 'What is a Fiber, and what did it make possible?',
      back: `A Fiber is a JS object (a linked-list node) for one component instance: its type, props, state, the **hooks list**, and pointers to \`child\`, \`sibling\` and \`return\` (parent), plus pending work and effect flags.

Before Fiber, rendering was one deep recursive call that couldn't stop. With Fiber, React walks a linked list it can **pause, prioritise and resume**: that is the foundation of concurrent features (\`useTransition\`, Suspense, streaming).`,
    },
    {
      kind: 'flashcard',
      id: 'r-f3',
      title: 'The two trees',
      front: 'What are the "current" and "work-in-progress" trees, and what does the `alternate` pointer do?',
      back: `React keeps **two fiber trees**: **current** (what's on screen) and **work-in-progress** (being built for the next update). Each fiber's \`alternate\` points to its counterpart in the other tree.

After commit, React swaps them: WIP becomes current, and the old current is **recycled** as the next WIP instead of being thrown away (double buffering, like in graphics).`,
    },
    {
      kind: 'flashcard',
      id: 'r-f4',
      title: 'Why hooks must keep their order',
      front: "Why can't hooks be called conditionally?",
      back: `React stores hooks on the fiber as a **list indexed by call order**: slot 0 is the first \`useState\`, slot 1 the next hook, and so on. It has no names to go by.

If a hook is skipped on one render, every later hook reads the wrong slot (state from a different hook). Hence the rules: call hooks at the top level, in the same order, only from components and custom hooks.`,
    },
    {
      kind: 'quiz',
      id: 'r-q1',
      title: 'Reconciliation and keys',
      prompt: 'Why is using the array index as `key` a problem for a list where items can be inserted at the top?',
      options: [
        'Keys shift, so React reuses the wrong component instances: state and DOM (e.g. input values) stick to the wrong rows',
        'Index keys are slower to compare than strings',
        'React throws an error for numeric keys',
        'Index keys disable React.memo',
      ],
      answer: 0,
      why: "React matches children by key between renders; with index keys, inserting at the top shifts every key, so React pairs each existing instance with the wrong item: it re-renders all rows with new props and keeps state and DOM (input values, focus) by position. Use a stable id from the data. **Not 'slower to compare':** number vs string comparison cost is irrelevant. **Not 'throws for numeric keys':** numeric keys are allowed. **Not 'disables React.memo':** memo works, it just sees different props per position.",
    },
    {
      kind: 'quiz',
      id: 'r-q2',
      title: 'When useCallback helps',
      prompt: 'When does wrapping a handler in `useCallback` actually prevent work?',
      options: [
        'When it is passed to a `React.memo` child, or used in a dependency array',
        'Always: it makes every render faster',
        'Only for event handlers on DOM elements',
        'When the component has no props',
      ],
      answer: 0,
      why: "`useCallback` only keeps the same function reference, which helps only when something compares references: a `React.memo` child's props or an effect/memo dependency array. **Not 'always faster':** otherwise it is extra work and memory each render. **Not 'DOM handlers only':** DOM elements don't care about handler identity at all. **Not 'no props':** irrelevant; it is about who receives the function. `useCallback(fn, deps)` equals `useMemo(() => fn, deps)`.",
    },
    {
      kind: 'quiz',
      id: 'r-q3',
      title: 'What makes a component re-render?',
      prompt: 'Which of these cause a component to re-render?',
      options: ['Its state changes', 'Its parent re-renders (and it is not memoized)', 'A context it consumes changes', "A ref's `.current` is mutated"],
      answer: [0, 1, 2],
      why: "A component re-renders when its own state changes, when its parent re-renders (unless memoized and props are equal), or when a context it consumes changes. **Not mutating a ref:** refs are deliberately outside React's update system, which is why they hold timers, previous values and DOM nodes.",
    },
    {
      kind: 'code',
      id: 'shallow-equal',
      title: "shallowEqual (React.memo's comparison)",
      difficulty: 'easy',
      prompt:
        'Implement the comparison `React.memo` uses for props: same keys, and each value equal by `Object.is`, one level deep only. Then explain why an inline `() => {}` prop defeats it.',
      ...code('shallow-equal'),
    },
  ],
};

export const stateManagement: Topic = {
  slug: 'state-management',
  title: 'Context, Redux & state architecture',
  questions: [
    {
      kind: 'quiz',
      id: 'sm-q1',
      title: 'Splitting state and actions contexts',
      prompt:
        'A context value is `{ value, setValue }`. A `<SaveButton>` only uses `setValue`. Why does it re-render whenever `value` changes, and what fixes it?',
      options: [
        'Every consumer re-renders when the context value changes; split into a State context and a memoized Actions context',
        'Buttons always re-render; wrap it in useCallback',
        'Because setValue changes identity on every render; there is no fix',
        'Context only re-renders the Provider; it must be a parent re-render',
      ],
      answer: 0,
      why: "Context has no selectors: when the provided object changes, every consumer re-renders, even one that only reads `setValue`. Split into a State context and an Actions context whose value is memoized (setters are stable), so action-only consumers never re-render. **Not 'buttons always re-render; useCallback':** the cause is the context value, and useCallback on the button changes nothing. **Not 'setValue changes identity':** `useState` setters are stable. **Not 'only the Provider re-renders':** consumers re-render directly on value changes.",
    },
    {
      kind: 'quiz',
      id: 'sm-q2',
      title: 'Context or Redux?',
      prompt: 'Which state is a good fit for plain React Context?',
      options: [
        'Theme, locale and the logged-in user',
        'A live trading dashboard updating many times a second',
        'A large cart synced with inventory, needing time-travel debugging',
        'Complex async flows that need middleware',
      ],
      answer: 0,
      why: 'Context is a dependency-injection mechanism and shines for low-frequency, app-wide values like theme, locale and the current user. **Not a live trading dashboard:** high-frequency updates would re-render every consumer; a store with selectors re-renders only affected slices. **Not a large synced cart with time travel:** Redux DevTools and normalized state fit that. **Not complex async flows with middleware:** context has no middleware; Redux Toolkit (thunks, RTK Query) or similar does.',
    },
    {
      kind: 'quiz',
      id: 'sm-q3',
      title: 'Why immutability',
      prompt: 'Why does `obj.count = 1; setState(obj)` not re-render?',
      options: [
        'React compares state with Object.is; the reference is unchanged, so it bails out',
        'setState only accepts primitives',
        'Direct mutation throws in strict mode',
        'It does re-render, but only after a delay',
      ],
      answer: 0,
      why: "React decides whether state changed with `Object.is`; after mutating, `obj` is the same reference, so `setState(obj)` bails out. Create a new object: `setState({ ...obj, count: 1 })`. **Not 'primitives only':** state can be any value. **Not 'throws in strict mode':** JS allows mutating a non-frozen object, and StrictMode doesn't freeze state. **Not 'delayed re-render':** there is no re-render at all. Mutation also breaks memo and time-travel debugging.",
    },
    {
      kind: 'flashcard',
      id: 'sm-f1',
      title: 'Redux in three sentences',
      front: 'Explain the Redux data flow and what a slice is.',
      back: `One **store** holds the app state. Components **dispatch actions** (plain objects describing what happened), and pure **reducers** return the next state immutably. Subscribers (via \`useSelector\`) re-render only if the part of state they select changed.

A **slice** (Redux Toolkit) bundles one feature's state, reducers and generated action creators; the root state is the combination of slices. Middleware (thunks, listeners) handles side effects and async.`,
    },
    {
      kind: 'flashcard',
      id: 'sm-f2',
      title: 'Provider hell',
      front: 'How do you avoid deeply nested providers in App.jsx?',
      back: `A **ProviderComposer** that folds an array of providers with \`reduceRight\`:

\`\`\`
const Compose = ({ providers, children }) =>
  providers.reduceRight((acc, p) => cloneElement(p, {}, acc), children);
\`\`\`

Adding a provider becomes a one-line diff. But also question whether every provider needs to be global: colocate state, and use the URL for shareable state.`,
    },
    {
      kind: 'code',
      id: 'create-store',
      title: 'Build a Redux store',
      difficulty: 'medium',
      prompt: `Implement \`createStore(reducer)\` with \`getState\`, \`dispatch\` and \`subscribe\`.

- initial state = \`reducer(undefined, { type: '@@INIT' })\`
- \`dispatch\` runs the reducer, notifies subscribers, and returns the action
- \`subscribe\` returns an unsubscribe function; unsubscribing during a dispatch must not skip anyone
- a reducer that dispatches throws \`Error('Reducers may not dispatch actions.')\``,
      ...code('create-store'),
    },
    {
      kind: 'code',
      id: 'combine-reducers',
      title: 'combineReducers',
      difficulty: 'medium',
      prompt:
        'Combine slice reducers into one root reducer whose state is keyed by slice. Unchanged slices keep their reference, and if **nothing** changed, return the same root object so `===` checks downstream can bail out.',
      ...code('combine-reducers'),
    },
  ],
};
