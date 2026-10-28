export type Reducer<S, A> = (state: S | undefined, action: A) => S;
export type Store<S, A> = { getState(): S; dispatch(action: A): A; subscribe(listener: () => void): () => void };

export function createStore<S, A extends { type: string }>(reducer: Reducer<S, A>): Store<S, A> {
  let state = reducer(undefined, { type: '@@INIT' } as A); // the reducer gives us the starting state
  let listeners: (() => void)[] = [];
  let isDispatching = false;

  function getState() {
    return state;
  }

  function dispatch(action: A) {
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }
    isDispatching = true;
    try {
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }
    // Loop over a copy: a listener that unsubscribes must not make us skip the next one.
    const current = [...listeners];
    for (const listener of current) {
      listener();
    }
    return action;
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { getState, dispatch, subscribe };
}
