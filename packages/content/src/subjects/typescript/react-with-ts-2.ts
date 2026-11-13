import type { Question } from '../../types';

export const reactTsQuestions2: Question[] = [
  {
    kind: 'quiz',
    id: 'tsr-q8',
    title: 'Mutually exclusive props need never',
    difficulty: 'hard',
    prompt: 'Without any `?: never` members, does this compile?',
    code: `type SignProps =
  | { value: number; isPositive: boolean }
  | { value: number; isNegative: boolean }
  | { value: number; zero: boolean };

const p: SignProps = { value: 1, isPositive: true, zero: true };`,
    options: [
      'Yes: for a union, a property is only "excess" if no member declares it; add `isNegative?: never; zero?: never` etc. to forbid mixing',
      'No: a union value must match exactly one member',
      'No: `zero` is reported as an excess property',
      'Yes, but only because `boolean` is too wide; `true` literals would fix it',
    ],
    answer: 0,
    why: "The literal is assignable to the first member structurally, and excess-property checking against a union only flags keys that appear in none of the members, so `zero` slips through; giving each member the other flags as `?: never` makes any second flag a type error, which is how you encode 'exactly one of'. **Not 'must match exactly one member':** unions are not exclusive. **Not 'zero is an excess property':** `zero` exists on a member, so it is not excess. **Not 'true literals would fix it':** the flag type is irrelevant; the missing `never` keys are the problem.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q9',
    title: 'Generic List infers T from items',
    difficulty: 'easy',
    prompt: 'What is the type of `item` inside `onClick`?',
    code: `type ListProps<T> = { items: T[]; onClick: (item: T) => void };
function List<T>({ items, onClick }: ListProps<T>) { /* … */ }

<List items={[{ id: 1, first: 'Bruce' }]} onClick={(item) => console.log(item)} />`,
    options: ['`{ id: number; first: string }`', '`unknown`', '`any`', '`{ id: 1; first: "Bruce" }`'],
    answer: 0,
    why: "JSX props are inferred like function arguments: `items` gives `T = { id: number; first: string }` and `onClick`'s parameter is then contextually typed from `T`, so a single generic component serves strings, numbers and objects. **Not unknown:** that is only what you get when nothing constrains `T`. **Not any:** generics keep the type. **Not the literal type:** object literal properties are widened (`1` to `number`) unless you use `as const`.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q10',
    title: 'Template literal toast positions',
    difficulty: 'medium',
    prompt: 'Which values are assignable to `ToastPosition`?',
    code: `type Horizontal = 'left' | 'right' | 'center';
type Vertical = 'top' | 'bottom' | 'center';
type ToastPosition = Exclude<\`\${Horizontal}-\${Vertical}\`, 'center-center'> | 'center';`,
    options: ["`'left-top'`", "`'center'`", "`'top-left'`", "`'center-center'`"],
    answer: [0, 1],
    why: "A template literal type over two unions produces the cross product (`3 × 3 = 9` strings), `Exclude` drops `'center-center'`, and `| 'center'` adds the shorthand, so `'left-top'` and `'center'` are allowed. **Not 'top-left':** the pattern is horizontal first, and template literal types are ordered. **Not 'center-center':** `Exclude` removed it.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q11',
    title: 'Class component state field',
    difficulty: 'hard',
    prompt: 'Why does `this.state.label` error here even though `CounterState` declares `label`?',
    code: `type CounterState = { count: number; label?: string };
class Counter extends Component<CounterProps, CounterState> {
  state = { count: 0 };
  render() { return <p>{this.state.label}</p>; }
}`,
    options: [
      'The `state` field is typed from its initializer (`{ count: number }`), which redeclares the inherited type; annotate it: `state: CounterState = { count: 0 }`',
      '`Component` takes `<State, Props>`, so the generics are swapped',
      'Optional fields are not allowed in class component state',
      '`state` must be set in the constructor, never as a class field',
    ],
    answer: 0,
    why: "A class field without an annotation gets the type of its initializer, not the base class's, so `state` narrows to `{ count: number }` (still assignable to `Readonly<CounterState>`, so no error at the declaration) and `label` disappears; annotating `state: CounterState` keeps the full shape. `this.props` and `setState` still use the generics. **Not 'generics are swapped':** the order is `Component<Props, State>`. **Not 'optional fields not allowed':** they are fine. **Not 'must be set in the constructor':** a class field is the idiomatic way; it just needs the annotation.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q12',
    title: 'currentTarget vs target',
    difficulty: 'medium',
    prompt: 'In this handler, which line is a type error?',
    code: `function onClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.currentTarget.disabled); // (1)
  console.log(e.target.disabled);        // (2)
}`,
    options: ['(2): `target` is only `EventTarget`', '(1): `currentTarget` is only `EventTarget`', 'Both', 'Neither'],
    answer: 0,
    why: 'The element generic types `currentTarget`, the element the handler is attached to, while `target` is whatever was actually clicked (maybe a child `<span>`), so React types it as plain `EventTarget`. **Not (1):** `currentTarget` is `HTMLButtonElement`. **Not both:** only `target` is loose. **Not neither:** `EventTarget` has no `disabled`. Likewise a bare `ChangeEvent` defaults to `Element`, so `e.target.value` fails until you write `ChangeEvent<HTMLInputElement>`.',
  },
  {
    kind: 'quiz',
    id: 'tsr-q13',
    title: 'Passing a component as a prop',
    difficulty: 'medium',
    prompt: 'A `<Private component={Profile} />` route renders `<Component name="settings" />` when logged in. How should the `component` prop be typed?',
    options: ['`React.ComponentType<ProfileProps>`', '`React.ReactNode`', '`React.JSX.Element`', '`() => void`'],
    answer: 0,
    why: "`ComponentType<P>` is a function or class component that accepts props `P`, so the route can render it as `<Component {...props} />` and TS checks the props you pass. **Not React.ReactNode:** that is already-rendered output (`<Profile />`), which you can't give new props. **Not React.JSX.Element:** same, an element rather than a component. **Not () => void:** a component returns something renderable and takes props.",
  },
  {
    kind: 'quiz',
    id: 'tsr-q14',
    title: 'forwardRef swallows generics',
    difficulty: 'hard',
    prompt: 'In `onPick`, `v` comes out as `unknown`. What is the React 19 fix?',
    code: `const Input = forwardRef(<T,>(props: { value?: T; onPick?: (v: T) => void }, ref: Ref<HTMLInputElement>) => …);
<Input value={1} onPick={(v) => v.toFixed()} />`,
    options: [
      'Drop `forwardRef` and take `ref` as a normal prop: `function Input<T>({ ref, ...props }: Props<T> & { ref?: Ref<HTMLInputElement> })`',
      'Write `forwardRef<number>` at the call site',
      'Cast the result: `forwardRef(...) as any`',
      'Add `T extends {}` to the inner function',
    ],
    answer: 0,
    why: "`forwardRef` returns a non-generic `ForwardRefExoticComponent<P>`, so `T` is fixed once (to `unknown`) when it is called; in React 19 function components receive `ref` as an ordinary prop, so a plain generic function keeps inference per use. **Not forwardRef<number>:** that pins a single type for every use and its generics are `<Element, Props>` anyway. **Not as any:** removes all checking. **Not T extends {}:** the constraint doesn't stop the generic being erased.",
  },
  {
    kind: 'flashcard',
    id: 'tsr-f1',
    title: 'The typed context recipe',
    difficulty: 'medium',
    front: 'How do you type a React context so consumers never deal with `undefined`?',
    back: `1. Type the value and default to \`undefined\`: \`createContext<Ctx | undefined>(undefined)\`.
2. Export a hook that narrows by throwing:

\`\`\`
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx; // Ctx
}
\`\`\`

3. Type setters from \`useState\` as \`Dispatch<SetStateAction<T>>\`.

Avoid \`createContext({} as Ctx)\`: it compiles but turns a missing provider into a runtime crash. If the context has a sensible default (a theme object), pass it and let inference type the context.`,
  },
  {
    kind: 'flashcard',
    id: 'tsr-f2',
    title: 'ReactNode vs ReactElement vs JSX.Element',
    difficulty: 'easy',
    front: 'When do you use `ReactNode`, `ReactElement` and `JSX.Element`?',
    back: `- **ReactNode**: anything renderable (elements, strings, numbers, \`null\`, booleans, arrays, React 19 promises). Use for \`children\` and "slot" props.
- **ReactElement<P>**: a single element object (\`<X />\`), with its props type. Use when you must \`cloneElement\` or read \`props\`.
- **JSX.Element**: \`ReactElement<any, any>\`, the type a JSX expression produces. Rarely needed in annotations.

React 19 types removed the global \`JSX\` namespace: write \`React.JSX.Element\`. Components can return any \`ReactNode\`, so you rarely annotate return types at all.`,
  },
  {
    kind: 'flashcard',
    id: 'tsr-f3',
    title: 'Polymorphic component recipe',
    difficulty: 'hard',
    front: 'How do you type a polymorphic `<Box as="a" href="…">` component?',
    back: `Make the element a generic inferred from \`as\`, then merge your own props over that element's props:

\`\`\`
type Props<E extends React.ElementType, Own> = Own & { as?: E } &
  Omit<React.ComponentPropsWithoutRef<E>, keyof Own | 'as'>;

function Box<E extends React.ElementType = 'div'>({ as, tone, ...rest }: Props<E, BoxOwnProps>) {
  const Tag: React.ElementType = as ?? 'div'; // TS can't relate the generic rest to E
  return <Tag data-tone={tone} {...rest} />;
}
\`\`\`

\`Omit\` lets your own props replace clashing native ones; destructure them so they are not spread onto the DOM. Annotating \`Tag\` as \`ElementType\` is the usual escape hatch inside the body, while callers stay fully checked. In React 19, add \`ref\` by using \`ComponentProps<E>\` instead, since \`ref\` is a normal prop.`,
  },
];
