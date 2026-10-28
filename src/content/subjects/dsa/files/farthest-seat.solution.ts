export function maxDistToClosest(seats: number[]): number {
  let prev = -1; // the last taken seat we saw
  let best = 0;
  for (let i = 0; i < seats.length; i++) {
    if (seats[i] === 1) {
      if (prev === -1) {
        best = i; // empty seats at the start: sit at seat 0
      } else {
        best = Math.max(best, Math.floor((i - prev) / 2)); // sit in the middle of the gap
      }
      prev = i;
    }
  }
  return Math.max(best, seats.length - 1 - prev); // empty seats at the end: sit at the last seat
}
