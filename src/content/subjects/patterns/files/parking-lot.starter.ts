/**
 * Low-level design: a parking lot.
 * - new ParkingLot(capacity, ratePerHour, now = () => Date.now()), with slots numbered 1..capacity
 * - park(plate): returns the lowest free slot id, or null when full; the same plate can't park twice (throw Error)
 * - exit(slotId): frees the slot and returns the fee, ceil(hours parked) × rate, minimum 1 hour; throws for an empty or unknown slot
 * - available(): number of free slots
 * - findSlot(plate): slot id or null
 * Inject `now` so time is testable (and think about where pricing rules would live if they grew).
 */
export class ParkingLot {
  constructor(capacity: number, ratePerHour: number, now: () => number = () => Date.now()) {
    // your code
  }
  park(plate: string): number | null {
    // your code
  }
  exit(slotId: number): number {
    // your code
  }
  available(): number {
    // your code
  }
  findSlot(plate: string): number | null {
    // your code
  }
}
