export function at<T>(arr: T[], index: number): T | undefined {
  if (index < 0) {
    index = arr.length + index; // -1 means the last item
  }
  if (index < 0 || index >= arr.length) {
    return undefined;
  }
  return arr[index];
}

export function find<T>(arr: T[], pred: (v: T, i: number) => boolean): T | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i], i)) {
      return arr[i];
    }
  }
  return undefined;
}

export function findIndex<T>(arr: T[], pred: (v: T, i: number) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

export function every<T>(arr: T[], pred: (v: T, i: number) => boolean): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (!pred(arr[i], i)) {
      return false;
    }
  }
  return true;
}

export function some<T>(arr: T[], pred: (v: T, i: number) => boolean): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i], i)) {
      return true;
    }
  }
  return false;
}

export function fill<T>(arr: T[], value: T, start = 0, end = arr.length): T[] {
  // Negative positions count from the end, like the native fill.
  if (start < 0) start = Math.max(arr.length + start, 0);
  if (end < 0) end = arr.length + end;
  if (end > arr.length) end = arr.length;

  for (let i = start; i < end; i++) {
    arr[i] = value;
  }
  return arr;
}
