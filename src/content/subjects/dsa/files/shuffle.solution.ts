// Fisher-Yates: swap each position with a random position at or before it.
// Don't use arr.sort(() => Math.random() - 0.5): some orders come up more often than others.
export function shuffle<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
