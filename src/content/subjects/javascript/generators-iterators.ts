import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('javascript', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const generators: Topic = {
  slug: 'generators-iterators',
  title: 'Iterators, generators & modern syntax',
  questions: [
    {
      kind: 'output',
      id: 'gen-1',
      title: 'the first next() argument is ignored',
      code: `function* ids(start = 0) {
  let id = start;
  while (true) yield id++;
}
const gen = ids(10);
console.log(gen.next(3).value);
console.log(gen.next(6).value);
console.log(gen.next().value);`,
      why: "Arguments to next() become the value of the PAUSED yield expression. The first next() starts the function, with no yield waiting to receive it, so 3 is dropped. Here the yields' results are never used anyway, so it just counts 10, 11, 12.",
    },
    {
      kind: 'output',
      id: 'gen-2',
      title: 'two-way communication with yield',
      code: `function* gen() {
  const a = yield 1;
  const b = yield a + 2;
  return b + 3;
}
const g = gen();
console.log(g.next());
console.log(g.next(5));
console.log(g.next(10));
console.log(g.next());`,
      why: 'next(5) resumes the first yield with a = 5, so the next yield is 7. next(10) sets b = 10 and hits return 13, which produces done: true. Once finished, a generator only returns { value: undefined, done: true }.',
    },
    {
      kind: 'output',
      id: 'gen-3',
      title: 'asking questions with a generator',
      code: `function* startGame() {
  const answer = yield 'Do you love JavaScript?';
  if (answer !== 'Yes') return "Oh wow... Guess we're done here";
  return 'JavaScript loves you back';
}
const game = startGame();
console.log(game.next().value);
console.log(game.next('Yes').value);
console.log(game.next().value);`,
      why: 'The first next() runs to the yield and hands out the question. next("Yes") resumes with answer = "Yes" and the function returns. A finished generator yields undefined forever.',
    },
    {
      kind: 'output',
      id: 'gen-4',
      title: 'for...of ignores the return value',
      code: `function* g() {
  yield 1;
  yield* [2, 3];
  return 4;
}
console.log([...g()]);
for (const v of g()) console.log(v);`,
      why: 'Spread and for...of stop as soon as done is true, and the value that comes WITH done: true (the return value) is dropped. yield* delegates to another iterable, one value at a time.',
    },
    {
      kind: 'output',
      id: 'gen-5',
      title: 'tagged template literals',
      code: `function tag(strings, ...values) {
  console.log(strings);
  console.log(values);
  return strings.raw.length;
}
const person = 'Lydia';
const age = 21;
console.log(tag\`\${person} is \${age} years old\`);`,
      why: "A tag receives the static string parts first (always one more than the number of expressions, here an empty string before ${person}), then each interpolated value. This is how styled-components and GraphQL's gql work.",
    },
    {
      kind: 'output',
      id: 'gen-6',
      title: 'a hand-written iterator',
      code: `const range = {
  start: 1,
  end: 3,
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next: () => (current <= end ? { value: current++, done: false } : { value: undefined, done: true }),
    };
  },
};
console.log([...range]);
console.log(Math.max(...range), Array.from(range, (x) => x * 10));`,
      why: 'Anything with a [Symbol.iterator]() returning { next() } is iterable, so spread, for...of, Array.from and destructuring all work on it. Because a new iterator is created each time, the object can be iterated repeatedly.',
    },
    {
      kind: 'quiz',
      id: 'gen-q1',
      title: 'Imported bindings are read-only',
      prompt: "In `index.js`: `import myCounter from './counter'; myCounter += 1;` What happens?",
      code: `// counter.js
let counter = 10;
export default counter;`,
      options: [
        'TypeError: assignment to a constant variable. Imports are read-only live bindings',
        'myCounter becomes 11 only in index.js',
        "counter.js's counter becomes 11 too",
        'It works, but logs a warning',
      ],
      answer: 0,
      why: "Imported bindings are read-only: assigning to `myCounter` throws TypeError ('Assignment to constant variable'), whether or not the exporter used `let`. **Not 'becomes 11 only in index.js':** importers can't create a local copy by assigning. **Not 'counter.js changes too':** only the exporting module can change its own variables. **Not 'works with a warning':** module code is strict, so it throws. Named `export let` bindings are live; `export default counter` exports the value at that moment.",
    },
    {
      kind: 'quiz',
      id: 'gen-q2',
      title: 'Generators vs async/await',
      prompt: 'Which statement about generators is FALSE?',
      options: [
        'Calling a generator function runs its body immediately',
        'They are lazy: values are computed only when `next()` asks',
        'An exhausted generator cannot be restarted',
        '`async/await` can be thought of as generators + promises',
      ],
      answer: 0,
      why: "FALSE statement: calling a generator function does NOT run its body; it only returns a paused iterator, and the body runs up to the first `yield` on the first `next()`. The other three are true: values are computed lazily on demand, a finished generator keeps returning `{ value: undefined, done: true }` and can't restart, and async/await is essentially generators that yield promises plus a runner (how co and early transpilers implemented it).",
    },
    {
      kind: 'flashcard',
      id: 'gen-f1',
      title: 'Iterator protocol',
      front: 'What makes an object iterable, and what does the iterator return?',
      back: `**Iterable**: has a \`[Symbol.iterator]()\` method returning an **iterator**.
**Iterator**: has \`next()\` returning \`{ value, done }\`. Optionally \`return()\`, which is called when a loop exits early (break/throw) so it can clean up.

Generators implement both automatically. Arrays, strings, Maps, Sets, \`arguments\` and NodeLists are built-in iterables; plain objects are **not**.`,
    },
    {
      kind: 'code',
      id: 'iterable-range',
      title: 'Iterable range + lazy take',
      difficulty: 'medium',
      prompt: `Build \`range(start, end, step)\` as an **iterable** without a generator (implement \`[Symbol.iterator]\` and \`next\` yourself), and \`take(iterable, n)\` that pulls only as many values as it needs, so it works on infinite iterables.

Bonus: rewrite \`range\` as a generator function and compare.`,
      ...code('iterable-range'),
    },
  ],
};
