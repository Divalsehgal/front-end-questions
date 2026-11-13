export function getByPath(obj: unknown, path: string | readonly (string | number)[], defaultValue?: unknown): any {
  let keys: readonly (string | number)[];
  if (typeof path === 'string') {
    // "a.b[0].c" → ["a", "b", "0", "c"]
    keys = path.replaceAll('[', '.').replaceAll(']', '').split('.').filter((key) => key !== '');
  } else {
    keys = path;
  }

  let current: any = obj;
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }
  if (current === undefined) {
    return defaultValue;
  }
  return current;
}
