type Reducer<S = any> = (state: S | undefined, action: { type: string }) => S;

/**
 * combineReducers({ todos, filter }) → one reducer whose state is { todos, filter },
 * each slice handled by its own reducer.
 * IMPORTANT: if no slice changed, return the SAME state object, so subscribers and
 * React.memo can bail out on reference equality.
 */
export function combineReducers(reducers: Record<string, Reducer>): Reducer<Record<string, any>> {
  // your code
}
