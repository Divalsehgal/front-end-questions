import { Config } from './solution';
test('always the same instance', () => {
  Config.resetForTests();
  assert.equal(Config.getInstance(), Config.getInstance());
});
test('state is shared through the instance', () => {
  Config.resetForTests();
  Config.getInstance().set('theme', 'dark');
  assert.equal(Config.getInstance().get('theme'), 'dark');
});
test('new Config() is blocked once an instance exists', () => {
  Config.resetForTests();
  Config.getInstance();
  let threw = false;
  try {
    new (Config as any)();
  } catch {
    threw = true;
  }
  assert.ok(threw);
});
test('resetForTests gives a fresh instance', () => {
  const a = Config.getInstance();
  Config.resetForTests();
  assert.notEqual(Config.getInstance(), a);
});
