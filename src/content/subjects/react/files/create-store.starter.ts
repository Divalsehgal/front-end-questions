export type Reducer<S, A> = (state: S | undefined, action: A) => S;
export type Store<S, A> = {
  getState(): S;
  dispatch(action: A): A;
  subscribe(listener: () => void): () => void;
};

/**
 * A minimal Redux store.
 * - initial state comes from calling the reducer with (undefined, { type: '@@INIT' })
 * - dispatch runs the reducer, then notifies every subscriber; it returns the action
 * - subscribe returns an unsubscribe function
 * - dispatching from inside a reducer throws Error('Reducers may not dispatch actions.')
 */
export function createStore<S, A extends { type: string }>(reducer: Reducer<S, A>): Store<S, A> {
  // your code
}
