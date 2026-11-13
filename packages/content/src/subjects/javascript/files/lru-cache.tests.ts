import { LRUCache } from './solution';

test('evicts the least recently used', () => {
  const c = new LRUCache<string, number>(2);
  c.put('a', 1);
  c.put('b', 2);
  c.put('c', 3);
  assert.equal(c.get('a'), undefined);
  assert.equal(c.get('b'), 2);
  assert.equal(c.get('c'), 3);
  assert.equal(c.size, 2);
});

test('get refreshes recency', () => {
  const c = new LRUCache<string, number>(2);
  c.put('a', 1);
  c.put('b', 2);
  c.get('a');
  c.put('c', 3);
  assert.equal(c.get('b'), undefined);
  assert.equal(c.get('a'), 1);
});

test('put on an existing key updates and refreshes it', () => {
  const c = new LRUCache<string, number>(2);
  c.put('a', 1);
  c.put('b', 2);
  c.put('a', 10);
  c.put('c', 3);
  assert.equal(c.get('a'), 10);
  assert.equal(c.get('b'), undefined);
  assert.equal(c.size, 2);
});

test('capacity 1', () => {
  const c = new LRUCache<number, string>(1);
  c.put(1, 'one');
  c.put(2, 'two');
  assert.equal(c.get(1), undefined);
  assert.equal(c.get(2), 'two');
});

test('a miss changes nothing', () => {
  const c = new LRUCache<string, number>(2);
  c.put('a', 1);
  assert.equal(c.get('zzz'), undefined);
  assert.equal(c.size, 1);
});
