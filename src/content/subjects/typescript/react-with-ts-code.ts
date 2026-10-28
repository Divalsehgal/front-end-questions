import { codeFiles } from '../../files';
import type { Question } from '../../types';

// Fixtures live in ./files/tsr-*.{starter,solution,types}.ts (copy them into subjects/typescript/files/).
const code = codeFiles('typescript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const reactTsCodeQuestions: Question[] = [
  {
    kind: 'code',
    id: 'tsr-toast-position',
    title: 'Type challenge: toast positions',
    difficulty: 'easy',
    prompt:
      "Use template literal types to build `ToastPosition` (every `horizontal-vertical` pair except `'center-center'`, plus `'center'`) and `CssLength` (a number followed by `px`, `rem` or `%`). **Check types** is the test.",
    ...code('tsr-toast-position'),
  },
  {
    kind: 'code',
    id: 'tsr-exclusive-props',
    title: 'Type challenge: exactly one flag prop',
    difficulty: 'hard',
    prompt:
      'Build `ExclusiveFlags<K>` so `<Sign value={n} isPositive />` accepts **exactly one** of `isPositive`, `isNegative`, `isZero`: none or two must be a compile error. Hint: one union member per key, with the other keys typed `?: never`.',
    ...code('tsr-exclusive-props'),
  },
  {
    kind: 'code',
    id: 'tsr-polymorphic-props',
    title: "Type challenge: polymorphic 'as' props",
    difficulty: 'hard',
    prompt:
      "Implement `PolymorphicProps<E, Own>` for a `<Text as=\"a\" href=\"…\">` component: the native props follow the tag passed in `as`, and your own props **replace** native props with the same name (an `input`'s numeric `size` must give way to `'sm' | 'md' | 'lg'`). A small `IntrinsicProps` map stands in for `JSX.IntrinsicElements`.",
    ...code('tsr-polymorphic-props'),
  },
  {
    kind: 'code',
    id: 'tsr-handler-props',
    title: 'Type challenge: on* handler props',
    difficulty: 'medium',
    prompt:
      'Write `HandlerProps<Events>`, which turns `{ click: MouseEvent; keyDown: KeyboardEvent }` into optional `onClick` / `onKeyDown` handler props. Hint: key remapping (`as`), a template literal, and `Capitalize`.',
    ...code('tsr-handler-props'),
  },
];
