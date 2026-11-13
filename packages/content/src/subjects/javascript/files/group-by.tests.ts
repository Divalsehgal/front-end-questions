import { countBy, groupBy } from './solution';

test('groupBy with a function', () => {
  assert.deepEqual(groupBy([6.1, 4.2, 6.3], Math.floor), { 4: [4.2], 6: [6.1, 6.3] });
});

test('groupBy keeps the original order inside each group', () => {
  const rows = [[1, 2, 3], [1, 3, 5], [1, 2, 9]];
  assert.deepEqual(groupBy(rows, (r) => String(r[1])), { 2: [[1, 2, 3], [1, 2, 9]], 3: [[1, 3, 5]] });
});

test('groupBy with a property name', () => {
  assert.deepEqual(groupBy(['one', 'two', 'three'], 'length'), { 3: ['one', 'two'], 5: ['three'] });
});

test('countBy', () => {
  assert.deepEqual(countBy([6.1, 4.2, 6.3], Math.floor), { 4: 1, 6: 2 });
  assert.deepEqual(countBy(['one', 'two', 'three'], 'length'), { 3: 2, 5: 1 });
});

test('empty input', () => {
  assert.deepEqual(groupBy([], (x) => String(x)), {});
  assert.deepEqual(countBy([], (x) => String(x)), {});
});
