import type { Question } from '../../types';

// Append to the existing `react-typescript` topic (react-typescript.ts): questions: [...existing, ...reactTsQuestions, ...reactTsQuestions2, ...reactTsCodeQuestions]
export const reactTsQuestions: Question[] = [
  {
    kind: 'quiz',
    id: 'tsr-q1',
    title: 'React.FC and children',
    difficulty: 'easy',
    prompt: 'With React 18+ types, does `<Card title="x">hi</Card>` compile?',
    code: `const Card: React.FC<{ title: string }> = ({ title }) => <div>{title}</div>;`,
    options: [
      'No: `FC` no longer adds `children`; declare `children: React.ReactNode` (or use `PropsWithChildren<P>`)',
      'Yes: `FC` always includes `children` implicitly',
      'Yes, but `children` is typed as `any`',
      'No: function components can never receive children in TypeScript',
    ],
    answer: 0,
    why: "Since `@types/react` 18, `FC<P>` is just `(props: P) => ReactNode`, so passing children to a component whose props don't declare them is an error; add `children: React.ReactNode` (or wrap with `PropsWithChildren<P>`) when the component really renders them. **Not 'FC always includes children implicitly':** that was the React 17 typing, removed because it let components silently accept children they ignored. **Not typed as any:** there is no implicit `children` at all. **Not 'never receive children':** they can, once `children` is in the props type.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q2',
    title: 'ReactNode vs JSX.Element for children',
    difficulty: 'easy',
    prompt: 'A `Layout` must accept text, `null`, an array of elements or a single element as `children`. Which prop type fits?',
    options: ['`React.ReactNode`', '`React.JSX.Element`', '`React.ReactElement`', '`string | React.JSX.Element`'],
    answer: 0,
    why: "`ReactNode` is everything React can render: elements, strings, numbers, `null`/`undefined`/booleans, iterables of those, and (React 19) promises, so it is the right type for `children`. **Not React.JSX.Element:** that is only the result of a JSX expression, so `null`, `'text'` and arrays are rejected. **Not React.ReactElement:** same problem, it is a single element object. **Not string | React.JSX.Element:** still misses `null`, numbers and arrays. React 19 types also dropped the global `JSX` namespace, so write `React.JSX.Element` when you do need it.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q3',
    title: 'useRef for a DOM node (React 19 types)',
    difficulty: 'medium',
    prompt: 'In React 19 types, what is the type of `inputRef`, and why do you write `inputRef.current?.focus()`?',
    code: `const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);
return <input ref={inputRef} />;`,
    options: [
      '`RefObject<HTMLInputElement | null>`: `current` is `null` until React attaches the node (and after unmount)',
      '`RefObject<HTMLInputElement>` with a readonly `current`',
      '`MutableRefObject<HTMLInputElement>`, so `?.` is unnecessary',
      '`HTMLInputElement`: `useRef` returns the node directly',
    ],
    answer: 0,
    why: 'Passing `null` to `useRef<HTMLInputElement>` picks the `useRef<T>(initialValue: T | null): RefObject<T | null>` overload, so `current` is honestly `HTMLInputElement | null` and must be narrowed; React 19 also made `RefObject.current` mutable and deprecated `MutableRefObject`. **Not RefObject<HTMLInputElement> with a readonly current:** that was the React 18 typing for this call. **Not MutableRefObject<HTMLInputElement>:** that is deprecated, and the node really is `null` before mount. **Not HTMLInputElement:** `useRef` always returns a `{ current }` box.',
  },
  {
    kind: 'quiz',
    id: 'tsr-q4',
    title: 'A ref that stores a timer id',
    difficulty: 'medium',
    prompt: 'You keep an interval id in a ref so a Stop button can clear it. Which declaration type-checks in a project that also has `@types/node` installed?',
    code: `const timerRef = useRef</* ? */>(null);
timerRef.current = setInterval(tick, 1000);`,
    options: [
      '`useRef<ReturnType<typeof setInterval> | null>(null)`',
      '`useRef<number | null>(null)`',
      '`useRef<HTMLElement | null>(null)`',
      '`useRef<null>(null)`',
    ],
    answer: 0,
    why: "With `@types/node` loaded, the global `setInterval` returns `NodeJS.Timeout` rather than `number`, so `ReturnType<typeof setInterval>` stays correct whichever typings win (calling `window.setInterval` explicitly also gives `number`). The ref is mutable data, not a DOM node, so assigning to `current` is the whole point. **Not number | null:** fails as soon as Node's typings shadow the DOM ones. **Not HTMLElement | null:** a timer id is not a DOM node. **Not null:** the ref could then only ever hold `null`.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q5',
    title: 'Typed context with a guard hook',
    difficulty: 'medium',
    prompt: 'What is the return type of `useUser()`, and what happens if a component calls it outside `<UserProvider>`?',
    code: `type UserCtx = { user: User | null; setUser: Dispatch<SetStateAction<User | null>> };
const UserContext = createContext<UserCtx | undefined>(undefined);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}`,
    options: [
      '`UserCtx`; it throws a clear error at render time',
      '`UserCtx | undefined`; callers still need `?.`',
      '`UserCtx`; it silently returns an empty object',
      '`any`, because `createContext` erases the type',
    ],
    answer: 0,
    why: "`useContext` returns `UserCtx | undefined`, and the `throw` narrows it, so the hook's inferred return type is plain `UserCtx` and consumers never write `value?.user`; a missing provider becomes a loud error instead of a silent `undefined`. **Not UserCtx | undefined:** the `if (!ctx) throw` removes `undefined` by control-flow narrowing. **Not 'returns an empty object':** that is the `createContext({} as UserCtx)` hack, which lies to the compiler and crashes later on `setUser`. **Not any:** `createContext<T>` keeps `T`.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q6',
    title: 'Overriding a native prop',
    difficulty: 'medium',
    prompt: 'A generic `<Input<T>>` wants its own `value?: T`. Why `Omit` the native `value` instead of just intersecting?',
    code: `type InputProps<T> = Omit<ComponentProps<'input'>, 'value'> & { value?: T };`,
    options: [
      'An intersection would combine both `value` types (`(string | number | readonly string[]) & T`) instead of replacing it',
      '`Omit` makes the component faster at runtime',
      "Intersections can't contain optional properties",
      'Without `Omit`, `T` would be inferred as `any`',
    ],
    answer: 0,
    why: "Intersecting two object types intersects the types of a property they share, so `ComponentProps<'input'> & { value?: T }` would demand a `value` that is both a native input value and a `T` (often `never` in practice); `Omit` removes the native key first so yours replaces it. **Not 'faster at runtime':** types are erased. **Not 'intersections can't contain optional properties':** they can. **Not 'T inferred as any':** inference is unaffected; the property type is the problem.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q7',
    title: "Polymorphic 'as' prop",
    difficulty: 'hard',
    prompt: 'Which of these JSX lines are type errors?',
    code: `type TextProps<E extends React.ElementType> = { as?: E; size?: 'sm' | 'md' | 'lg' } &
  Omit<React.ComponentProps<E>, 'as' | 'size'>;
function Text<E extends React.ElementType = 'span'>({ as, ...rest }: TextProps<E>) { /* … */ }

<Text as="label" htmlFor="name">Name</Text>   // (1)
<Text as="p1">Hello</Text>                     // (2)
<Text as="label" href="/home">Home</Text>      // (3)
<Text as="a" href="/home" size="md">Home</Text> // (4)`,
    options: ['(1)', '(2)', '(3)', '(4)'],
    answer: [1, 2],
    why: "`E` is inferred from `as`, then `ComponentProps<E>` supplies exactly that element's props: (2) fails because `'p1'` is not a key of `JSX.IntrinsicElements` (so it breaks the `E extends ElementType` constraint), and (3) fails because `href` is not a `label` prop. **Not (1):** `htmlFor` is a valid `label` prop. **Not (4):** `href` is an anchor prop and `size` comes from the own props, which `Omit` keeps from clashing with any native `size`.",
  },
];
