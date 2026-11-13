import { area, assertNever, isAdmin } from './solution';

test('isAdmin', () => {
  assert.equal(isAdmin({ name: 'Dival', privileges: ['all'] }), true);
  assert.equal(isAdmin({ name: 'Alice', startDate: new Date() }), false);
});

test('area of each shape', () => {
  assert.equal(area({ kind: 'square', size: 3 }), 9);
  assert.equal(area({ kind: 'rect', w: 2, h: 5 }), 10);
  assert.ok(Math.abs(area({ kind: 'circle', r: 1 }) - Math.PI) < 1e-9);
});

test('assertNever throws', () => {
  let threw = false;
  try {
    assertNever('oops' as never);
  } catch {
    threw = true;
  }
  assert.ok(threw);
});
