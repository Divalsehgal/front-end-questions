import { QueryBuilder } from './solution';
test('full chain', () => {
  const q = new QueryBuilder('users').select('id', 'name').where('age > 18').where("country = 'IN'").orderBy('name').limit(10).build();
  assert.equal(q, "SELECT id, name FROM users WHERE age > 18 AND country = 'IN' ORDER BY name ASC LIMIT 10");
});
test('defaults to SELECT *', () => {
  assert.equal(new QueryBuilder('posts').build(), 'SELECT * FROM posts');
  assert.equal(new QueryBuilder('posts').select().orderBy('created', 'DESC').build(), 'SELECT * FROM posts ORDER BY created DESC');
});
test('methods are chainable and build is repeatable', () => {
  const b = new QueryBuilder('t');
  assert.equal(b.select('a'), b);
  assert.equal(b.build(), b.build());
});
test('validates limit', () => {
  let threw = false;
  try {
    new QueryBuilder('t').limit(0);
  } catch {
    threw = true;
  }
  assert.ok(threw);
});
