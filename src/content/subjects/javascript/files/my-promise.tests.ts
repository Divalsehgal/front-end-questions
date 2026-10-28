import { MyPromise } from './solution';

test('resolves and passes the value to then', async () => {
  const v = await new Promise((done) => new MyPromise<number>((r) => setTimeout(() => r(42), 5)).then(done));
  assert.equal(v, 42);
});

test('then handlers run asynchronously even when already resolved', async () => {
  const log: string[] = [];
  const p = new MyPromise<number>((r) => r(1));
  p.then(() => log.push('then'));
  log.push('sync');
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(log, ['sync', 'then']);
});

test('chaining passes return values along', async () => {
  const v = await new Promise((done) =>
    new MyPromise<number>((r) => r(2))
      .then((x) => x * 3)
      .then((x) => x + 1)
      .then(done),
  );
  assert.equal(v, 7);
});

test('returning a promise from then waits for it', async () => {
  const v = await new Promise((done) =>
    new MyPromise<number>((r) => r(1))
      .then((x) => new MyPromise<number>((r) => setTimeout(() => r(x + 10), 5)))
      .then(done),
  );
  assert.equal(v, 11);
});

test('a throw in then skips to catch, and catch can recover', async () => {
  const log: unknown[] = [];
  await new Promise((done) =>
    new MyPromise<number>((r) => r(1))
      .then(() => {
        throw new Error('boom');
      })
      .then(() => log.push('skipped'))
      .catch((e) => {
        log.push((e as Error).message);
        return 'recovered';
      })
      .then((v) => {
        log.push(v);
        done(null);
      }),
  );
  assert.deepEqual(log, ['boom', 'recovered']);
});

test('settles only once', async () => {
  const seen: unknown[] = [];
  new MyPromise<number>((resolve, reject) => {
    resolve(1);
    resolve(2);
    reject(new Error('ignored'));
  }).then((v) => seen.push(v), () => seen.push('rejected'));
  await new Promise((r) => setTimeout(r, 5));
  assert.deepEqual(seen, [1]);
});

test('executor throwing rejects the promise', async () => {
  const msg = await new Promise((done) =>
    new MyPromise(() => {
      throw new Error('bad executor');
    }).catch((e) => done((e as Error).message)),
  );
  assert.equal(msg, 'bad executor');
});

test('finally runs on both paths and passes the value through', async () => {
  const log: unknown[] = [];
  await new Promise((done) =>
    MyPromise.resolve(5)
      .finally(() => log.push('f1'))
      .then((v) => log.push(v))
      .then(() => MyPromise.reject(new Error('x')))
      .finally(() => log.push('f2'))
      .catch((e) => {
        log.push((e as Error).message);
        done(null);
      }),
  );
  assert.deepEqual(log, ['f1', 5, 'f2', 'x']);
});

test('works with await (it is a thenable)', async () => {
  assert.equal(await MyPromise.resolve('awaited'), 'awaited');
});
