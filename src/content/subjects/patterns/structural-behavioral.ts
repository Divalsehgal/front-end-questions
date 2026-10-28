import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('patterns', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const structuralBehavioral: Topic = {
  slug: 'structural-behavioral',
  title: 'Structural & behavioral patterns',
  questions: [
    {
      kind: 'output',
      id: 'pt-o3',
      title: 'A logging proxy',
      code: `const user = { name: 'Dival', age: 25 };
const userProxy = new Proxy(user, {
  get(target, prop) {
    console.log('get', prop);
    return target[prop];
  },
});
userProxy.name = 'Minal';
console.log(userProxy.name, user.name);`,
      why: 'Only reads are trapped. The write goes straight through to the target (there\'s no set trap), so user.name changes too. Reading userProxy.name logs "get name" first, while console.log is still evaluating its arguments.',
    },
    {
      kind: 'output',
      id: 'pt-o4',
      title: 'Observer: order of notifications',
      code: `const subscribers = [];
const subscribe = (fn) => {
  subscribers.push(fn);
  return () => subscribers.splice(subscribers.indexOf(fn), 1);
};
const notify = (data) => [...subscribers].forEach((fn) => fn(data));

const off1 = subscribe((d) => console.log('User1:', d));
subscribe((d) => console.log('User2:', d));
notify('first');
off1();
notify('second');`,
      why: 'Subscribers run in subscription order. The unsubscribe function closes over its own listener. Copying the array before iterating protects against listeners that unsubscribe during a notify.',
    },
    {
      kind: 'quiz',
      id: 'pt-q3',
      title: 'Name the pattern',
      prompt: 'React higher-order components like `connect()(Component)` or `memo(Component)` are an example of which pattern?',
      options: ['Decorator', 'Adapter', 'Facade', 'Proxy'],
      answer: 0,
      why: 'A decorator wraps something to add behaviour while keeping the same interface, and an HOC takes a component and returns a component. **Not Adapter:** an adapter changes the interface to fit another one. **Not Facade:** a facade hides a whole subsystem behind a simpler API. **Not Proxy:** a proxy controls access to the same object (lazy load, cache, validate) rather than layering features. Middleware and `withLogging(fn)` are decorators too.',
    },
    {
      kind: 'quiz',
      id: 'pt-q4',
      title: 'Adapter vs facade vs proxy',
      prompt:
        'Match: "make an old API\'s response shape fit our types" · "one `startCar()` that calls fuel, battery and engine checks" · "intercept property access for validation or caching".',
      options: ['Adapter · Facade · Proxy', 'Facade · Adapter · Proxy', 'Proxy · Facade · Adapter', 'Adapter · Proxy · Facade'],
      answer: 0,
      why: "Reshaping an old API to fit our types converts an interface (Adapter); one `startCar()` over fuel, battery and engine simplifies a subsystem (Facade); intercepting property access controls access to an object (Proxy). **Not Facade · Adapter · Proxy:** the first two are swapped. **Not Proxy · Facade · Adapter:** reshaping data isn't access control, and interception isn't conversion. **Not Adapter · Proxy · Facade:** a single entry point over many calls isn't a stand-in object.",
    },
    {
      kind: 'quiz',
      id: 'pt-q5',
      title: 'Observer in the wild',
      prompt: 'Which of these are the Observer pattern?',
      options: ['`addEventListener`', "A Redux store's `subscribe`", 'RxJS Observables / `IntersectionObserver`', '`Array.prototype.map`'],
      answer: [0, 1, 2],
      why: 'Observer means a subject keeps a list of listeners and notifies them on change: DOM `addEventListener`, Redux `store.subscribe`, RxJS Observables and `IntersectionObserver` all do exactly that. **Not Array.prototype.map:** it transforms an array once, synchronously; nothing subscribes or gets notified. Remember to unsubscribe to avoid leaks.',
    },
    {
      kind: 'flashcard',
      id: 'pt-f2',
      title: 'Iterator pattern',
      front: 'What is the Iterator pattern, and how does JavaScript build it in?',
      back: `It gives one uniform way to traverse a collection without exposing how it's stored. JS bakes it in through the **iterator protocol**: \`[Symbol.iterator]()\` returning \`{ next() → { value, done } }\`. Generators implement it for you.

Because of it, \`for...of\`, spread, destructuring and \`Array.from\` work the same on arrays, Maps, Sets, strings, NodeLists, and your own trees or ranges.`,
    },
    {
      kind: 'code',
      id: 'decorators-adapter',
      title: 'Decorator, adapter & facade',
      difficulty: 'medium',
      prompt:
        'Implement `withLogging` and `withRetry` (decorators), `toMillionsAdapter` (adapter), and `startCar` (facade that stops at the first failing step).',
      ...code('decorators-adapter'),
    },
  ],
};
