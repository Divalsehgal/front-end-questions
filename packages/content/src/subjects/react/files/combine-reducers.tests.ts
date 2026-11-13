import { combineReducers } from './solution';

const todos = (state: string[] = [], a: any) => (a.type === 'add' ? [...state, a.text] : state);
const filter = (state = 'all', a: any) => (a.type === 'filter' ? a.value : state);
const root = combineReducers({ todos, filter });

test('builds initial state from every slice', () => {
  assert.deepEqual(root(undefined, { type: '@@INIT' }), { todos: [], filter: 'all' });
});

test('routes each action to every slice reducer', () => {
  let s = root(undefined, { type: '@@INIT' });
  s = root(s, { type: 'add', text: 'learn' } as any);
  s = root(s, { type: 'filter', value: 'done' } as any);
  assert.deepEqual(s, { todos: ['learn'], filter: 'done' });
});

test('unchanged slices keep their reference', () => {
  const s1 = root(undefined, { type: '@@INIT' });
  const s2 = root(s1, { type: 'filter', value: 'done' } as any);
  assert.equal(s2.todos, s1.todos, 'todos slice should be the same array');
});

test('returns the SAME root object when nothing changed', () => {
  const s1 = root(undefined, { type: '@@INIT' });
  assert.equal(root(s1, { type: 'unknown' }), s1);
});
