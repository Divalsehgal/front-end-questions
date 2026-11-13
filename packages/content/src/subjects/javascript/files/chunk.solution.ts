export function chunk<T>(arr: readonly T[], size = 1): T[][] {
  if (size < 1) {
    return [];
  }
  const result: T[][] = [];
  let temp: T[] = [];
  for (const item of arr) {
    temp.push(item);
    if (temp.length === size) {
      result.push(temp);
      temp = [];
    }
  }
  if (temp.length > 0) {
    result.push(temp); // the last, shorter chunk
  }
  return result;
}
