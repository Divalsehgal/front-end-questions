export function merge(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]); // a copy, so the input is not changed
  const result: [number, number][] = [];
  let start = sorted[0][0];
  let end = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] <= end) {
      end = Math.max(end, sorted[i][1]); // overlaps: stretch the current interval
    } else {
      result.push([start, end]);
      start = sorted[i][0];
      end = sorted[i][1];
    }
  }
  result.push([start, end]);
  return result;
}
