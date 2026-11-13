import { createVersionWatcher } from './solution';

const serving = (...versions: (string | Error)[]) => {
  let i = 0;
  return fn(() => {
    const v = versions[Math.min(i++, versions.length - 1)];
    return v instanceof Error ? Promise.reject(v) : Promise.resolve(v);
  });
};

test('not stale while the live version matches', async () => {
  const w = createVersionWatcher({ current: '1.4.2', fetchVersion: serving('1.4.2') });
  assert.equal(w.isStale(), false);
  assert.equal(await w.check(), false);
  assert.equal(w.navigationMode('/products'), 'spa');
});

test('stale once a different version is live; the next navigation is a full load', async () => {
  const w = createVersionWatcher({ current: '1.4.2', fetchVersion: serving('1.5.0') });
  assert.equal(await w.check(), true);
  assert.equal(w.isStale(), true);
  assert.equal(w.navigationMode('/products'), 'full');
});

test('a failed or empty fetch changes nothing and does not throw', async () => {
  const w = createVersionWatcher({ current: '1', fetchVersion: serving(new Error('offline'), '', '2', new Error('500')) });
  assert.equal(await w.check(), false, 'offline must not mark the tab stale');
  assert.equal(await w.check(), false, 'an empty version is not a new version');
  assert.equal(await w.check(), true);
  assert.equal(await w.check(), true, 'a later failure must not clear a known new version');
});

test('a rollback to the running version clears the stale flag', async () => {
  const w = createVersionWatcher({ current: '1', fetchVersion: serving('2', '1') });
  await w.check();
  assert.equal(await w.check(), false);
});

test('never forces a full load inside a held flow', async () => {
  const w = createVersionWatcher({ current: '1', fetchVersion: serving('2'), holdOn: ['/checkout'] });
  await w.check();
  assert.equal(w.navigationMode('/checkout'), 'spa');
  assert.equal(w.navigationMode('/checkout/payment'), 'spa');
  assert.equal(w.navigationMode('/cart'), 'full');
});

test('a held path matches whole segments only', async () => {
  const w = createVersionWatcher({ current: '1', fetchVersion: serving('2'), holdOn: ['/checkout'] });
  await w.check();
  assert.equal(w.navigationMode('/checkout-faq'), 'full');
});
