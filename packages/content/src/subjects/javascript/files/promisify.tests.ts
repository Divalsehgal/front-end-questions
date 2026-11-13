import { promisify } from './solution';

function multiply(a: number, b: number, cb: (err: unknown, r?: number) => void) {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') cb(new TypeError('Arguments must be numbers'));
    else cb(null, a * b);
  }, 1);
}

test('resolves with the callback result', async () => {
  assert.equal(await promisify<number>(multiply)(5, 3), 15);
});

test('rejects with the callback error', async () => {
  await assert.rejects(promisify(multiply)('5', 3), /must be numbers/);
});

test('appends the callback after the given args', async () => {
  const seen: unknown[] = [];
  const fn = (a: number, b: number, c: number, cb: (e: unknown, r?: number) => void) => {
    seen.push(a, b, c);
    cb(null, a + b + c);
  };
  assert.equal(await promisify<number>(fn)(1, 2, 3), 6);
  assert.deepEqual(seen, [1, 2, 3]);
});

test('keeps `this`', async () => {
  const obj = {
    base: 10,
    add(n: number, cb: (e: unknown, r?: number) => void) {
      cb(null, this.base + n);
    },
  };
  const add = promisify<number>(obj.add);
  assert.equal(await add.call(obj, 5), 15);
});

test('returns a real Promise', () => {
  assert.ok(promisify(multiply)(1, 1) instanceof Promise);
});
