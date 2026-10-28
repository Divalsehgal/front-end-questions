import type { Topic } from '../../types';

export const reactTypescript: Topic = {
  slug: 'react-typescript',
  title: 'React with TypeScript',
  questions: [
    {
      kind: 'quiz',
      id: 'rts-q1',
      title: 'Typing an input change handler',
      prompt: 'You extract `onChange` for an `<input>` into its own function. Which type should the event have?',
      options: ['`ChangeEvent<HTMLInputElement>`', '`Event`', '`MouseEvent<HTMLInputElement>`', '`FormEvent<HTMLFormElement>`'],
      answer: 0,
      why: "React types an input's `onChange` as `ChangeEventHandler<HTMLInputElement>`, so the extracted function takes `ChangeEvent<HTMLInputElement>` and `e.target.value` is typed. **Not Event:** the DOM `Event` isn't React's synthetic event and `target` is untyped. **Not MouseEvent:** that is for clicks. **Not FormEvent<HTMLFormElement>:** that is for a form's `onSubmit`.",
    },
    {
      kind: 'quiz',
      id: 'rts-q2',
      title: 'Extending native button props',
      prompt: 'How do you let a custom `<Button isLoading>` also accept every normal button attribute (disabled, aria-*, onClick…)?',
      options: [
        "`type Props = ComponentProps<'button'> & { isLoading?: boolean }`",
        'List each attribute by hand',
        '`type Props = any`',
        '`interface Props extends HTMLElement`',
      ],
      answer: 0,
      why: "`ComponentProps<'button'>` (or `ComponentPropsWithoutRef<'button'>`) is exactly the set of props React accepts on `<button>`; intersect your own and spread `...rest` onto the element. **Not listing by hand:** incomplete and drifts from React's types. **Not any:** loses all checking. **Not extends HTMLElement:** that is the DOM node type (methods like `focus()`), not JSX props.",
    },
    {
      kind: 'quiz',
      id: 'rts-q3',
      title: 'Generic components in .tsx',
      prompt: "Why does `const List = <T>(props: Props<T>) => …` break in a `.tsx` file, and what's the fix?",
      options: [
        'The parser reads `<T>` as a JSX tag; write `<T,>` or `<T extends unknown>`',
        'Arrow functions cannot be generic',
        'JSX components cannot take generic props',
        'You must use `React.FC<T>`',
      ],
      answer: 0,
      why: "In `.tsx`, `<T>` at the start of an arrow function parses as an opening JSX tag; `<T,>` or `<T extends unknown>` disambiguates. **Not 'arrows can't be generic':** they can in `.ts` files and with the fix. **Not 'components can't take generic props':** generic components are common (`List<T>`). **Not React.FC<T>:** `FC` can't express a generic component. Function declarations don't have the ambiguity.",
    },
    {
      kind: 'quiz',
      id: 'rts-q4',
      title: 'Passing setState down',
      prompt: 'What is the exact type of a `setCount` from `useState<number>` that you pass to a child?',
      options: ['`Dispatch<SetStateAction<number>>`', '`(n: number) => void`', '`Function`', '`SetState<number>`'],
      answer: 0,
      why: '`useState<number>` returns a setter typed `Dispatch<SetStateAction<number>>`, where `SetStateAction<number>` is `number | ((prev: number) => number)`, so the child can use functional updates. **Not (n: number) => void:** compiles for direct calls but forbids the updater form. **Not Function:** untyped, accepts anything. **Not SetState<number>:** React exports no such type.',
    },
    {
      kind: 'quiz',
      id: 'rts-q5',
      title: 'Async work in useEffect',
      prompt: 'Why is `useEffect(async () => { setData(await load()); }, [])` wrong, and what is the fix?',
      options: [
        'An async function returns a Promise, but the effect must return nothing or a cleanup function; define an async function inside the effect and call it',
        'Effects cannot call setState',
        'await is not allowed in .tsx files',
        'It is fine; React awaits the promise',
      ],
      answer: 0,
      why: "React treats the effect's return value as its cleanup, and an async function always returns a Promise (TypeScript flags it too); define an async function inside the effect, call it, and return a real cleanup that aborts or ignores late results. **Not 'effects can't setState':** they can. **Not 'await not allowed in .tsx':** it is allowed inside async functions. **Not 'React awaits the promise':** React ignores it, and an unhandled late response can set state after unmount.",
    },
    {
      kind: 'flashcard',
      id: 'rts-f1',
      title: 'Typing useState that starts empty',
      front: 'How do you type state for data that is still loading?',
      back: `Give the generic explicitly with \`null\` (or \`undefined\`) in the union: \`useState<User[] | null>(null)\`, then narrow before rendering (\`if (!data) return <Spinner />\`).

Without the generic, TS infers \`null\` and you can never set real data. For complex state with several related fields, prefer a **discriminated union** (\`{ status: 'loading' } | { status: 'done'; data: User[] }\`) so impossible states can't be represented.`,
    },
    {
      kind: 'flashcard',
      id: 'rts-f2',
      title: 'Typed reducers',
      front: 'How do you make `useReducer` actions type-safe?',
      back: `Model actions as a **discriminated union** on \`type\`:

\`type Action = { type: 'ADD'; payload: Todo } | { type: 'DELETE'; payload: number }\`

Inside \`switch (action.type)\` TS narrows \`payload\` per case, and a \`default: assertNever(action)\` makes a missing case a compile error. \`dispatch({ type: 'ADD', payload: 5 })\` won't compile.`,
    },
    {
      kind: 'flashcard',
      id: 'rts-f3',
      title: 'Decorators',
      front: 'What is a class decorator, and how would one log every method call?',
      back: `A decorator is a function applied with \`@name\` that receives the class (or method/field) and can return a replacement. A class decorator can return a **subclass** whose constructor wraps each prototype method:

\`\`\`
function LogMethodCalls<T extends new (...a: any[]) => {}>(Base: T) {
  return class extends Base { /* wrap methods from Base.prototype */ };
}
\`\`\`

TS 5 implements the standard (stage 3) decorators; older code uses \`experimentalDecorators\`. Angular, NestJS and MobX lean on them heavily.`,
    },
  ],
};
