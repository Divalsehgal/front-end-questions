import './solution';

const native = { map: Array.prototype.map, filter: Array.prototype.filter, reduce: Array.prototype.reduce };
const banNative = () => {
  Array.prototype.map = () => { throw new Error('native map is disabled'); };
  Array.prototype.filter = () => { throw new Error('native filter is disabled'); };
  Array.prototype.reduce = () => { throw new Error('native reduce is disabled'); };
};
const restore = () => Object.assign(Array.prototype, native);

test('myMap passes (value, index, array) and honours thisArg', () => {
  banNative();
  const arr = [1, 2, 3];
  const seen: unknown[] = [];
  const out = arr.myMap(function (this: { k: number }, v, i, a) {
    seen.push([i, a === arr]);
    return v * this.k;
  }, { k: 10 });
  restore();
  assert.deepEqual(out, [10, 20, 30]);
  assert.deepEqual(seen, [[0, true], [1, true], [2, true]]);
});

test('myFilter keeps truthy results', () => {
  banNative();
  const out = [1, 2, 3, 4].myFilter((v) => v % 2 === 0);
  restore();
  assert.deepEqual(out, [2, 4]);
});

test('myReduce with and without an initial value', () => {
  banNative();
  const sum = [1, 2, 3, 3, 5].myReduce((a: number, b) => a + b, 0);
  const noInit = [1, 2, 3].myReduce((a: number, b) => a + b);
  const toObj = ['a', 'b'].myReduce((acc: Record<string, number>, k, i) => ({ ...acc, [k]: i }), {});
  restore();
  assert.equal(sum, 14);
  assert.equal(noInit, 6);
  assert.deepEqual(toObj, { a: 0, b: 1 });
});

test('myReduce on an empty array without initial value throws TypeError', () => {
  banNative();
  let err: unknown;
  try {
    ([] as number[]).myReduce((a: number, b) => a + b);
  } catch (e) {
    err = e;
  }
  restore();
  assert.ok(err instanceof TypeError, 'expected a TypeError');
});

test('an explicit undefined initial value counts as an initial value', () => {
  banNative();
  const out = [1, 2].myReduce((acc: unknown[], v) => [...(acc ?? []), v], undefined as any);
  restore();
  assert.deepEqual(out, [1, 2]);
});

test('holes are skipped, like the native methods', () => {
  banNative();
  const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
  const calls: number[] = [];
  sparse.myMap((v, i) => calls.push(i));
  restore();
  assert.deepEqual(calls, [0, 2]);
});
