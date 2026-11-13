type Iteratee<T> = ((item: T) => PropertyKey) | keyof T;

function getKey<T>(item: T, iteratee: Iteratee<T>): PropertyKey {
  if (typeof iteratee === 'function') {
    return iteratee(item);
  }
  return item[iteratee] as PropertyKey; // a property name like 'length'
}

export function groupBy<T>(arr: readonly T[], iteratee: Iteratee<T>): Record<PropertyKey, T[]> {
  const result: Record<PropertyKey, T[]> = {};
  for (let i = 0; i < arr.length; i++) {
    const key = getKey(arr[i], iteratee);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(arr[i]);
  }
  return result;
}

export function countBy<T>(arr: readonly T[], iteratee: Iteratee<T>): Record<PropertyKey, number> {
  const result: Record<PropertyKey, number> = {};
  for (let i = 0; i < arr.length; i++) {
    const key = getKey(arr[i], iteratee);
    if (!result[key]) {
      result[key] = 0;
    }
    result[key]++;
  }
  return result;
}
