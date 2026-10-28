import { deepFreeze } from './solution';

test('freezes nested objects and arrays', () => {
  const cfg = deepFreeze({ level: 1, inner: { level: 1, list: [{ x: 1 }] } });
  assert.ok(Object.isFrozen(cfg));
  assert.ok(Object.isFrozen(cfg.inner));
  assert.ok(Object.isFrozen(cfg.inner.list));
  assert.ok(Object.isFrozen(cfg.inner.list[0]));
});

test('writes throw in strict mode', () => {
  const cfg: any = deepFreeze({ inner: { level: 1 } });
  let err: unknown;
  try {
    cfg.inner.level = 2;
  } catch (e) {
    err = e;
  }
  assert.ok(err instanceof TypeError);
  assert.equal(cfg.inner.level, 1);
});

test('freezes children of an already-frozen object', () => {
  const obj: any = deepFreeze({ a: Object.freeze({ b: {} }) });
  assert.ok(Object.isFrozen(obj.a.b));
});

test('returns the same object and handles cycles', () => {
  const a: any = { b: {} };
  a.b.a = a;
  assert.equal(deepFreeze(a), a);
  assert.ok(Object.isFrozen(a.b));
});
