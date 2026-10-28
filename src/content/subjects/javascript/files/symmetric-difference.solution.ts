export function sym(...arrays: number[][]): number[] {
  function diff(a: number[], b: number[]): number[] {
    const onlyInA = a.filter((x) => !b.includes(x));
    const onlyInB = b.filter((x) => !a.includes(x));
    return [...new Set([...onlyInA, ...onlyInB])]; // a value repeated in one array counts once
  }
  return arrays.reduce(diff, []);
}
