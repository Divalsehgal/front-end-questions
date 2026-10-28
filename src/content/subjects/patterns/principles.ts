import type { Topic } from '../../types';

export const principles: Topic = {
  slug: 'principles',
  title: 'SOLID, DRY, KISS & YAGNI',
  questions: [
    {
      kind: 'quiz',
      id: 'pr-q1',
      title: 'Which SOLID principle?',
      prompt: 'A `<UserCard>` fetches the user, formats dates, tracks analytics and renders the card. Which principle does it violate most?',
      options: ['Single Responsibility', 'Liskov Substitution', 'Interface Segregation', 'Open/Closed'],
      answer: 0,
      why: 'The component has four reasons to change (data fetching, date formatting, analytics, markup), which is the definition of violating Single Responsibility; split it into `useUser`, a formatter, an analytics hook and a presentational card. **Not Liskov:** there is no subtype being substituted. **Not Interface Segregation:** that is about consumers depending on more than they use. **Not Open/Closed:** that is about extending without editing; it may also suffer, but SRP is the main problem.',
    },
    {
      kind: 'quiz',
      id: 'pr-q2',
      title: 'Open/Closed in React',
      prompt: "How do you add a new button style without editing the `Button` component's internals every time?",
      options: [
        'Accept a `variant` from a config map, or composition (`icon`, `children`, `className`) so new behaviour plugs in from outside',
        'Add another `if (props.isPurple)` branch',
        'Copy-paste Button into PurpleButton',
        'Use !important in a global stylesheet',
      ],
      answer: 0,
      why: 'Open/Closed means open for extension, closed for modification: a variant config map or composition (`icon`, `children`, `className`) lets new styles plug in without touching tested internals. **Not another if branch:** that is modification every time. **Not copy-paste PurpleButton:** duplicates logic that will drift. **Not global !important:** bypasses the component and breaks the cascade for everyone.',
    },
    {
      kind: 'quiz',
      id: 'pr-q3',
      title: 'Liskov & interface segregation',
      prompt:
        'A `ReadOnlyList` extends `List` but throws in `add()`. A `<Avatar>` requires a full `user` object when it only uses `name` and `imageUrl`. Which principles are broken?',
      options: [
        'Liskov Substitution, then Interface Segregation',
        'Single Responsibility, then Open/Closed',
        'Dependency Inversion, then Liskov',
        'DRY, then KISS',
      ],
      answer: 0,
      why: "A subtype that throws on `add()` can't be used wherever `List` is expected (Liskov Substitution), and forcing `<Avatar>` to take a whole `user` when it reads two fields makes it depend on what it doesn't use (Interface Segregation). **Not SRP/OCP:** neither describes a broken subtype contract or a too-wide input. **Not DIP then Liskov:** no abstraction is being injected, and the order is reversed. **Not DRY/KISS:** nothing is duplicated or overcomplicated. Pass `{ name, imageUrl }`.",
    },
    {
      kind: 'quiz',
      id: 'pr-q4',
      title: 'Dependency inversion',
      prompt: 'Which is dependency inversion?',
      code: `// A
function saveUser(user) { return fetch('/api/users', { method: 'POST', body: JSON.stringify(user) }); }
// B
function makeSaveUser(api) { return (user) => api.post('/users', user); }`,
      options: [
        'B: high-level code depends on an abstraction (`api`) that is passed in, so it can be swapped or mocked',
        "A: it uses the browser's fetch abstraction",
        'Both are equivalent',
        'Neither; DI needs a framework',
      ],
      answer: 0,
      why: 'In B the high-level logic receives its dependency (`api`) as a parameter, so it depends on an abstraction that can be swapped (fetch, axios, GraphQL) or faked in tests. **Not A:** it hard-codes `fetch` and the URL, so the dependency is concrete and fixed. **Not equivalent:** only B can be tested without mocking globals. **Not needs a framework:** passing an argument is dependency injection; Context and props do it in React.',
    },
    {
      kind: 'quiz',
      id: 'pr-q5',
      title: 'DRY, KISS or YAGNI?',
      prompt: 'You build a plugin system "in case we need it later" for a form that has exactly one use today. Which principle says don\'t?',
      options: ['YAGNI', 'DRY', 'KISS', 'SRP'],
      answer: 0,
      why: "YAGNI (you aren't gonna need it) says don't build speculative flexibility for a requirement that doesn't exist; build for today and keep the code easy to change. **Not DRY:** there is no duplication to remove. **Not KISS:** related (the simple thing is simpler), but the specific smell is building for an imagined future. **Not SRP:** nothing here has too many responsibilities.",
    },
    {
      kind: 'flashcard',
      id: 'pr-f1',
      title: 'SOLID in one line each (frontend edition)',
      front: 'State all five SOLID principles with a React example each.',
      back: `- **S**ingle responsibility: one reason to change → custom hooks for logic, small presentational components
- **O**pen/closed: extend without editing → variants, composition, render props
- **L**iskov substitution: substitutes must honour the contract → a \`<LinkButton>\` must behave like a \`<Button>\`
- **I**nterface segregation: no unused dependencies → pass the fields a component needs, not whole objects
- **D**ependency inversion: depend on abstractions → inject the api client or services via props/context`,
    },
  ],
};
