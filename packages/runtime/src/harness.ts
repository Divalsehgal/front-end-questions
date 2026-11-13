// Tiny test framework that runs inside the sandbox worker.
// Test files get these as globals: test, assert, fn, clock.
import { format } from './format';

export type TestResult = { name: string; ok: boolean; error?: string; ms: number };

class AssertionError extends Error {
  name = 'AssertionError';
}

const show = (v: unknown) => format(v);

function deepEqual(a: unknown, b: unknown, seen = new Map<object, object>()): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (seen.get(a) === b) return true;
  seen.set(a, b);
  if (a instanceof Date) return a.getTime() === (b as Date).getTime();
  if (a instanceof Map) {
    const bm = b as Map<unknown, unknown>;
    return a.size === bm.size && [...a].every(([k, v]) => bm.has(k) && deepEqual(v, bm.get(k), seen));
  }
  if (a instanceof RegExp) return a.toString() === (b as RegExp).toString();
  if (a instanceof Set) return setsEqual(a, b as Set<unknown>, seen);
  const ka = Reflect.ownKeys(a);
  const kb = Reflect.ownKeys(b);
  return (
    ka.length === kb.length &&
    ka.every((k) => Object.hasOwn(b, k) && deepEqual((a as Record<PropertyKey, unknown>)[k], (b as Record<PropertyKey, unknown>)[k], seen))
  );
}

// Sets of objects compare by content (like node's assert.deepStrictEqual): each member of `a`
// must be in `b` or deep-equal a distinct, not-yet-matched member of `b`.
function setsEqual(a: Set<unknown>, b: Set<unknown>, seen: Map<object, object>): boolean {
  if (a.size !== b.size) return false;
  const unmatched = [...b].filter((v) => !a.has(v));
  return [...a].every((v) => {
    if (b.has(v)) return true;
    // A failed trial must not leave its pairings in `seen`, so each one gets its own copy.
    const i = unmatched.findIndex((u) => deepEqual(v, u, new Map(seen)));
    return i >= 0 && unmatched.splice(i, 1).length === 1;
  });
}

/** "expected X, got Y", prefixed with the caller's own message when there is one. */
function mismatch(actual: unknown, expected: unknown, message?: string) {
  const detail = `expected ${show(expected)}, got ${show(actual)}`;
  return new AssertionError(message ? `${message}: ${detail}` : detail);
}

export const assert = {
  equal(actual: unknown, expected: unknown, message?: string) {
    if (!Object.is(actual, expected)) throw mismatch(actual, expected, message);
  },
  notEqual(actual: unknown, expected: unknown, message?: string) {
    if (Object.is(actual, expected)) throw new AssertionError(message ?? `expected a value other than ${show(expected)}`);
  },
  deepEqual(actual: unknown, expected: unknown, message?: string) {
    if (!deepEqual(actual, expected)) throw mismatch(actual, expected, message);
  },
  ok(value: unknown, message?: string) {
    if (!value) throw new AssertionError(message ?? `expected a truthy value, got ${show(value)}`);
  },
  async rejects(promise: unknown, pattern?: RegExp) {
    if (!promise || typeof (promise as Promise<unknown>).then !== 'function') {
      throw new AssertionError(`expected a Promise, got ${show(promise)}`);
    }
    try {
      await (promise as PromiseLike<unknown>);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (pattern && !pattern.test(msg)) throw new AssertionError(`rejected with "${msg}", expected it to match ${pattern}`);
      return;
    }
    throw new AssertionError('expected the promise to reject, but it resolved');
  },
};

// Mocks stand in for callbacks of any signature, so `any` is deliberate here (unknown[] params
// would make a mock unassignable to typed callbacks).
/* eslint-disable @typescript-eslint/no-explicit-any */
export type MockFn = ((...args: any[]) => any) & { calls: unknown[][]; callCount: number };

export function fn(impl?: (...args: any[]) => any): MockFn {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const mock = function (this: unknown, ...args: unknown[]) {
    mock.calls.push(args);
    mock.callCount++;
    return impl?.apply(this, args);
  } as MockFn;
  mock.calls = [];
  mock.callCount = 0;
  return mock;
}

/** Fake setTimeout / setInterval / Date.now, advanced manually with clock.tick(ms). */
export function createClock() {
  // Bound: browsers throw "Illegal invocation" if timer functions are called with another `this`.
  const real = {
    setTimeout: setTimeout.bind(globalThis),
    clearTimeout: clearTimeout.bind(globalThis),
    setInterval: setInterval.bind(globalThis),
    clearInterval: clearInterval.bind(globalThis),
    now: Date.now.bind(Date),
  };
  const original = { setTimeout, clearTimeout, setInterval, clearInterval, now: Date.now };
  type Timer = { at: number; fn: (...a: unknown[]) => void; args: unknown[]; every?: number };
  const timers = new Map<number, Timer>();
  let now = 0;
  let nextId = 1;
  let installed = false;

  const schedule = (fn: Timer['fn'], args: unknown[], ms = 0, every?: number) => {
    const id = nextId++;
    timers.set(id, { at: now + Math.max(0, ms), fn, args, every });
    return id;
  };

  return {
    real,
    install() {
      if (installed) return;
      installed = true;
      now = real.now();
      Object.assign(globalThis, {
        setTimeout: (f: Timer['fn'], ms?: number, ...args: unknown[]) => schedule(f, args, ms),
        setInterval: (f: Timer['fn'], ms?: number, ...args: unknown[]) => schedule(f, args, ms, Math.max(1, ms ?? 0)),
        clearTimeout: (id: number) => timers.delete(id),
        clearInterval: (id: number) => timers.delete(id),
      });
      Date.now = () => now;
    },
    tick(ms: number) {
      if (!installed) throw new Error('clock.tick() called before clock.install()');
      const end = now + ms;
      for (;;) {
        let nextIdFound = -1;
        let next: Timer | undefined;
        for (const [id, t] of timers) if (t.at <= end && (!next || t.at < next.at)) [nextIdFound, next] = [id, t];
        if (!next) break;
        now = next.at;
        if (next.every) next.at += next.every;
        else timers.delete(nextIdFound);
        next.fn(...next.args);
      }
      now = end;
    },
    /** Drops pending timers between tests. */
    reset() {
      timers.clear();
    },
    /** Puts the real timers and Date.now back (the sandbox worker never needs this; in-process tests do). */
    restore() {
      if (!installed) return;
      installed = false;
      timers.clear();
      const { now: realNow, ...timerFns } = original;
      Object.assign(globalThis, timerFns);
      Date.now = realNow;
    },
  };
}

/** An assertion failure reads as just its message; anything else keeps its error name. */
const describeError = (e: unknown) => {
  if (!(e instanceof Error)) return String(e);
  return e.name === 'AssertionError' ? e.message : `${e.name}: ${e.message}`;
};

// Captured at load time: drills may disable Promise.race/all to stop learners using them.
const race = Promise.race.bind(Promise);

export async function runTests(
  register: (api: { test: (name: string, body: () => unknown) => void }) => void,
  clock: ReturnType<typeof createClock>,
  perTestTimeoutMs = 3000,
): Promise<TestResult[]> {
  const tests: { name: string; body: () => unknown }[] = [];
  register({ test: (name, body) => tests.push({ name, body }) });

  const results: TestResult[] = [];
  for (const t of tests) {
    const start = performance.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Tests run one at a time on purpose: they share the fake clock and global state, and each
      // one's timing and timeout are its own. Sonar S9382 (await in loop) is suppressed for that.
      const run = Promise.resolve().then(t.body);
      const timeout = new Promise((_, reject) => {
        timer = clock.real.setTimeout(() => reject(new Error(`timed out after ${perTestTimeoutMs}ms`)), perTestTimeoutMs);
      });
      await race([run, timeout]); // NOSONAR
      results.push({ name: t.name, ok: true, ms: performance.now() - start });
    } catch (e) {
      results.push({ name: t.name, ok: false, error: describeError(e), ms: performance.now() - start });
    } finally {
      // Otherwise every passing test leaves a live timer behind for perTestTimeoutMs.
      clock.real.clearTimeout(timer);
    }
    clock.reset();
  }
  return results;
}
