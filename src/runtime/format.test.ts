import { describe, expect, it } from 'vitest';
import { format, formatArgs, linesMatch, normalizeLine } from './format';

describe('format: primitives', () => {
  it('prints top-level strings bare and nested strings quoted', () => {
    expect(formatArgs(['outer', undefined, ['outer', undefined]])).toBe("outer undefined ['outer', undefined]");
    expect(format('s')).toBe("'s'");
    expect(format('s', true)).toBe('s');
    expect(format('', true)).toBe('');
  });

  it('formats numbers like a console, including -0 and NaN', () => {
    expect(format(-0)).toBe('-0');
    expect(format(0)).toBe('0');
    expect(format(NaN)).toBe('NaN');
    expect(format(Infinity)).toBe('Infinity');
    expect(format(-Infinity)).toBe('-Infinity');
    expect(format(1.5)).toBe('1.5');
    expect(format(1e21)).toBe('1e+21');
  });

  it('formats bigint, symbols, booleans, null and undefined', () => {
    expect(format(10n)).toBe('10n');
    expect(format(-3n)).toBe('-3n');
    expect(format(Symbol('x'))).toBe('Symbol(x)');
    expect(format(Symbol())).toBe('Symbol()');
    expect(format(Symbol.iterator)).toBe('Symbol(Symbol.iterator)');
    expect(format(true)).toBe('true');
    expect(format(false)).toBe('false');
    expect(format(null)).toBe('null');
    expect(format(undefined)).toBe('undefined');
  });

  it('formats functions and classes by name', () => {
    expect(format(function named() {})).toBe('ƒ named()');
    expect(format(() => 1)).toBe('ƒ ()');
    expect(format(async function load() {})).toBe('ƒ load()');
    expect(format(function* gen() {})).toBe('ƒ gen()');
    expect(format(class Foo {})).toBe('class Foo');
    expect(format(Math.max)).toBe('ƒ max()');
    expect(format({ f() {} })).toBe('{f: ƒ f()}');
  });

  it('joins several args with a space', () => {
    expect(formatArgs([])).toBe('');
    expect(formatArgs(['a', 1, 'b'])).toBe('a 1 b');
  });
});

describe('format: objects', () => {
  it('formats plain objects, quoting keys that are not identifiers', () => {
    expect(format({})).toBe('{}');
    expect(format({ a: 1, b: 's' })).toBe("{a: 1, b: 's'}");
    expect(format({ 'x-y': 1, $ok: 2, _u: 3, '1a': 4 })).toBe("{'x-y': 1, $ok: 2, _u: 3, '1a': 4}");
    expect(format({ 0: 'zero' })).toBe("{'0': 'zero'}");
  });

  it('omits symbol keys and non-enumerable properties', () => {
    const o = { a: 1, [Symbol('s')]: 2 };
    Object.defineProperty(o, 'hidden', { value: 3, enumerable: false });
    expect(format(o)).toBe('{a: 1}');
  });

  it('names class instances and null-prototype objects', () => {
    class Btn {
      label = 'ok';
    }
    expect(format(new Btn())).toBe("Btn {label: 'ok'}");
    expect(format(new (class {})())).toBe('{}');
    expect(format(Object.create({ inherited: 1 }))).toBe('{}');
    const bare = Object.create(null);
    bare.k = 1;
    expect(format(bare)).toBe('[Object: null prototype] {k: 1}');
    expect(format(new Number(1))).toBe('Number {}');
  });

  it('formats arrays, nested arrays and holes', () => {
    expect(format([])).toBe('[]');
    expect(format([1, [2, [3]], 'x'])).toBe("[1, [2, [3]], 'x']");
    // eslint-disable-next-line no-sparse-arrays
    expect(format([1, , 3])).toBe('[1, , 3]');
    expect(format([{ a: [1] }])).toBe('[{a: [1]}]');
  });

  it('collapses anything nested deeper than four levels', () => {
    expect(format([[[[[1]]]]])).toBe('[[[[[…]]]]]');
    expect(format({ a: { b: { c: { d: { e: 1 } } } } })).toBe('{a: {b: {c: {d: {…}}}}}');
    expect(format([[[[1]]]])).toBe('[[[[1]]]]');
  });

  it('formats Map and Set, including object keys and empties', () => {
    expect(format(new Map([['k', 1]]))).toBe("Map(1) {'k' => 1}");
    expect(format(new Map())).toBe('Map(0) {}');
    expect(format(new Map([[{ id: 1 }, [2]]]))).toBe('Map(1) {{id: 1} => [2]}');
    expect(format(new Set([1, 2]))).toBe('Set(2) {1, 2}');
    expect(format(new Set())).toBe('Set(0) {}');
    expect(format(new Set(['a', { b: 1 }]))).toBe("Set(2) {'a', {b: 1}}");
  });

  it('formats dates, regexps, errors and promises', () => {
    expect(format(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
    expect(format(/a+b/gi)).toBe('/a+b/gi');
    expect(format(new Error('boom'))).toBe('Error: boom');
    expect(format(new TypeError('bad'))).toBe('TypeError: bad');
    class MyErr extends Error {
      name = 'MyErr';
    }
    expect(format(new MyErr('x'))).toBe('MyErr: x');
    expect(format([new RangeError('r')])).toBe('[RangeError: r]');
    expect(format(Promise.resolve(1))).toBe('Promise {…}');
  });

  it('prints an invalid Date instead of throwing', () => {
    expect(format(new Date(NaN))).toBe('Invalid Date');
    expect(format({ d: new Date('nope') })).toBe('{d: Invalid Date}');
  });
});

describe('format: references', () => {
  it('marks circular references instead of recursing forever', () => {
    const a: Record<string, unknown> = { name: 'a' };
    a.self = a;
    expect(format(a)).toBe("{name: 'a', self: [Circular]}");
    const arr: unknown[] = [1];
    arr.push(arr);
    expect(format(arr)).toBe('[1, [Circular]]');
    const m = new Map<string, unknown>();
    m.set('m', m);
    expect(format(m)).toBe("Map(1) {'m' => [Circular]}");
    const s = new Set<unknown>();
    s.add(s);
    expect(format(s)).toBe('Set(1) {[Circular]}');
  });

  it('prints a shared (non-circular) reference in full each time', () => {
    const shared = { v: 1 };
    expect(format([shared, shared])).toBe('[{v: 1}, {v: 1}]');
    expect(format({ a: shared, b: [shared] })).toBe('{a: {v: 1}, b: [{v: 1}]}');
  });

  it('can be called again on the same object after a previous call', () => {
    const o = { x: 1 };
    expect(format(o)).toBe(format(o));
  });
});

describe('answer comparison', () => {
  it('ignores spacing, quote style and the (n) array prefix', () => {
    expect(normalizeLine(`(2) [ "a", 'b' ]`)).toBe('[a,b]');
    expect(normalizeLine('`t`  x')).toBe('tx');
    expect(normalizeLine('(2) foo')).toBe('(2)foo');
    expect(linesMatch("outer undefined ['outer', undefined]", 'outer undefined [ "outer",undefined ]')).toBe(true);
    expect(linesMatch('1 2', '12')).toBe(true);
    expect(linesMatch('1', '2')).toBe(false);
  });

  it('accepts several spellings of a thrown error', () => {
    const real = "Uncaught ReferenceError: Cannot access 'b' before initialization";
    for (const mine of ['ReferenceError', 'Uncaught ReferenceError', 'throws(ReferenceError)', 'throws ReferenceError', real]) {
      expect(linesMatch(mine, real)).toBe(true);
    }
    expect(linesMatch('ReferenceError: something else', real)).toBe(true);
    expect(linesMatch('TypeError', real)).toBe(false);
    expect(linesMatch('TypeError', 'Uncaught (in promise) TypeError: x')).toBe(true);
    expect(linesMatch('uncaught (in promise) TypeError', 'Uncaught (in promise) TypeError: x')).toBe(true);
  });

  it('does not treat a non-error line as a thrown error', () => {
    expect(linesMatch('Error', 'Error: boom')).toBe(false);
  });
});
