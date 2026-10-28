export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function update<T extends object>(original: T, changes: Partial<T>): T {
  return { ...original, ...changes };
}

export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
