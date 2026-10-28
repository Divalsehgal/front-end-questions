export function flatten(arr: readonly unknown[], depth = 1): unknown[] {
  const result: unknown[] = [];
  // A stack instead of recursion, so a very deep array can't overflow the call stack.
  // Each entry is [value, how many more levels we may still open].
  const stack: [unknown, number][] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    stack.push([arr[i], depth]);
  }

  while (stack.length > 0) {
    const [value, levels] = stack.pop()!;
    if (Array.isArray(value) && levels > 0) {
      // push in reverse so the first item comes off the stack first
      for (let i = value.length - 1; i >= 0; i--) {
        stack.push([value[i], levels - 1]);
      }
    } else {
      result.push(value);
    }
  }
  return result;
}
