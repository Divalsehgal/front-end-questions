import { normalizePosts } from './solution';

const ann = { id: 'u1', name: 'Ann' };
const bob = { id: 'u2', name: 'Bob' };
const data = [
  { id: 'p1', title: 'Hello', author: ann, comments: [{ id: 'c1', text: 'Nice', author: bob }] },
  { id: 'p2', title: 'Again', author: bob, comments: [{ id: 'c2', text: 'Thanks', author: ann }, { id: 'c3', text: '!', author: bob }] },
];

test('entities are stored once by id', () => {
  const n = normalizePosts(data);
  assert.deepEqual(n.users, { u1: ann, u2: bob });
  assert.deepEqual(Object.keys(n.comments), ['c1', 'c2', 'c3']);
});

test('relations become ids', () => {
  const n = normalizePosts(data);
  assert.deepEqual(n.posts.p2, { id: 'p2', title: 'Again', author: 'u2', comments: ['c2', 'c3'] });
  assert.deepEqual(n.comments.c2, { id: 'c2', text: 'Thanks', author: 'u1' });
});

test('order is preserved separately', () => {
  assert.deepEqual(normalizePosts(data).postIds, ['p1', 'p2']);
  assert.deepEqual(normalizePosts([]), { posts: {}, users: {}, comments: {}, postIds: [] });
});

test('does not keep references to the input objects', () => {
  const n = normalizePosts(data);
  n.users.u1.name = 'changed';
  assert.equal(ann.name, 'Ann');
});
