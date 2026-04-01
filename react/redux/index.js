/*

Redux maintains a single state object (store) that represents the entire app state,
which is updated immutably through actions and reducers.

const obj = { count: 0 }

obj.count = 1  

setState(obj)

react thinks nothing happened

setState({ ...obj, count: 1 })

Slices help structure the state into independent parts,
so when one slice updates.
only components subscribed to that slice re-render
due to reference changes.”

Same reference → skip render ✅
New reference → re-render ❌

Memoization only works when references are stable.

*/
