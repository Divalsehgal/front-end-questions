type Reducer<S = any> = (state: S | undefined, action: { type: string }) => S;

export function combineReducers(reducers: Record<string, Reducer>): Reducer<Record<string, any>> {
  return function (state = {}, action) {
    const nextState: Record<string, any> = {};
    let changed = false;
    for (const key in reducers) {
      nextState[key] = reducers[key](state[key], action); // each reducer only sees its own slice
      if (nextState[key] !== state[key]) {
        changed = true;
      }
    }
    // Nothing changed: return the old object, so `===` checks in components still pass.
    return changed ? nextState : state;
  };
}
