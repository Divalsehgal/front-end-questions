export function concat<T>(base: T[], ...items: (T | T[])[]): T[] {
  const result = [...base];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (Array.isArray(item)) {
      // arrays are opened one level only
      for (let j = 0; j < item.length; j++) {
        result.push(item[j]);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

export function forEach<T>(arr: T[], cb: (value: T, index: number, array: T[]) => void, thisArg?: unknown): void {
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      cb.call(thisArg, arr[i], i, arr);
    }
  }
}
