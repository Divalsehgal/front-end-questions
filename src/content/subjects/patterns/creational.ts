import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('patterns', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const creational: Topic = {
  slug: 'creational',
  title: 'Creational patterns',
  questions: [
    {
      kind: 'output',
      id: 'pt-o1',
      title: 'A frozen singleton',
      code: `class ConfigSingleton {
  constructor() {
    if (ConfigSingleton.instance) return ConfigSingleton.instance;
    this.started = false;
    ConfigSingleton.instance = this;
    Object.freeze(this);
  }
}
const a = new ConfigSingleton();
const b = new ConfigSingleton();
console.log(a === b);
try {
  a.name = 'Robert';
} catch (e) {
  console.log(e.name);
}
console.log(Object.keys(a), ConfigSingleton.instance === a);`,
      why: 'A constructor that RETURNS an object makes `new` give back that object, so the second `new` returns the cached instance. Because it is frozen, adding a property throws TypeError in strict mode (it would be silently ignored in sloppy mode).',
    },
    {
      kind: 'output',
      id: 'pt-o2',
      title: 'Prototype pattern with Object.create',
      code: `const enemy = {
  hp: 100,
  attack() { return this.name + ' attacks'; },
};
const bug = Object.create(enemy);
bug.name = 'Buggy';
console.log(bug.attack(), bug.hp, Object.keys(bug));
bug.hp -= 30;
console.log(bug.hp, enemy.hp, Object.keys(bug));`,
      why: 'Object.create links bug to enemy as its prototype: methods and defaults are shared, not copied. `bug.hp -= 30` READS 100 from the prototype and then WRITES an own property 70; the prototype keeps 100. Prefer Object.create over setPrototypeOf, which deoptimises objects at runtime.',
    },
    {
      kind: 'quiz',
      id: 'pt-q1',
      title: 'Factory vs abstract factory',
      prompt: "`vehicleFactory.createFactory('air').createVehicle('helicopter')`. Which pattern returns a whole family of related creators?",
      options: ['Abstract Factory', 'Factory Method', 'Builder', 'Prototype'],
      answer: 0,
      why: "`createFactory('air')` returns another factory, and that factory creates a consistent family (air vehicles): a factory of factories is Abstract Factory. **Not Factory Method:** one creator picks one concrete class, it doesn't hand back creators. **Not Builder:** builds one complex object step by step. **Not Prototype:** creates objects by cloning an existing instance.",
    },
    {
      kind: 'quiz',
      id: 'pt-q2',
      title: 'When a builder helps',
      prompt: 'Which situation calls for the Builder pattern?',
      options: [
        'An object with many optional parts, assembled step by step and validated at the end (queries, HTTP requests, test fixtures)',
        'You need exactly one instance app-wide',
        'Two incompatible interfaces must work together',
        'Several objects must react when one changes',
      ],
      answer: 0,
      why: 'Builder replaces telescoping constructors (`new Query(a, b, undefined, undefined, c)`) with readable chained steps and a final `build()` that can validate; think Knex/Prisma query builders and test-data builders. **Not exactly one instance:** that is Singleton. **Not incompatible interfaces:** that is Adapter. **Not reacting to changes:** that is Observer.',
    },
    {
      kind: 'flashcard',
      id: 'pt-f1',
      title: 'Singletons in JavaScript',
      front: 'How do you make a singleton in modern JS, and what is wrong with singletons?',
      back: `Simplest: **an ES module that exports an instance**. Modules are evaluated once and cached, so every importer gets the same object (\`export const store = createStore()\`). A class with a static \`getInstance()\` adds lazy creation.

Downsides: hidden global state, tight coupling, and order-dependent tests (state leaks between tests). Prefer passing dependencies in (dependency injection) and keep singletons for truly app-wide services (a logger, a config, an API client).`,
    },
    {
      kind: 'code',
      id: 'singleton',
      title: 'Singleton with getInstance',
      difficulty: 'easy',
      prompt:
        'Build `Config.getInstance()` that always returns the same instance, block `new Config()` from outside, store settings with get/set, and add `resetForTests()`. Then explain why you needed it.',
      ...code('singleton'),
    },
    {
      kind: 'code',
      id: 'query-builder',
      title: 'Fluent query builder',
      difficulty: 'easy',
      prompt:
        "Builder pattern: `new QueryBuilder('users').select(...).where(...).orderBy(...).limit(...).build()` produces the SQL string. Each step returns `this`, and `limit` validates its input.",
      ...code('query-builder'),
    },
  ],
};
