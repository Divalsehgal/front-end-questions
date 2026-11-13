import { createStore } from './solution';

type Action = { type: 'inc' } | { type: 'add'; by: number } | { type: '@@INIT' };
const counter = (state = 0, action: Action) => (action.type === 'inc' ? state + 1 : action.type === 'add' ? state + action.by : state);

test('initial state comes from the reducer', () => {
  assert.equal(createStore(counter).getState(), 0);
});

test('dispatch updates state and returns the action', () => {
  const store = createStore(counter);
  const action = { type: 'add', by: 5 } as const;
  assert.equal(store.dispatch(action), action);
  store.dispatch({ type: 'inc' });
  assert.equal(store.getState(), 6);
});

test('subscribers are notified after each dispatch, and can unsubscribe', () => {
  const store = createStore(counter);
  const seen: number[] = [];
  const unsubscribe = store.subscribe(() => seen.push(store.getState()));
  store.dispatch({ type: 'inc' });
  store.dispatch({ type: 'inc' });
  unsubscribe();
  store.dispatch({ type: 'inc' });
  assert.deepEqual(seen, [1, 2]);
});

test('unsubscribing during a dispatch does not skip other listeners', () => {
  const store = createStore(counter);
  const calls: string[] = [];
  const unsubA = store.subscribe(() => {
    calls.push('a');
    unsubA();
  });
  store.subscribe(() => calls.push('b'));
  store.dispatch({ type: 'inc' });
  store.dispatch({ type: 'inc' });
  assert.deepEqual(calls, ['a', 'b', 'b']);
});

test('reducers may not dispatch', () => {
  let store: any;
  const sneaky = (state = 0, action: { type: string }) => {
    if (action.type === 'boom') store.dispatch({ type: 'inner' });
    return state;
  };
  store = createStore(sneaky);
  let msg = '';
  try {
    store.dispatch({ type: 'boom' });
  } catch (e) {
    msg = (e as Error).message;
  }
  assert.equal(msg, 'Reducers may not dispatch actions.');
});
