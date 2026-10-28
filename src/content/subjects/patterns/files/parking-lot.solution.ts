const HOUR = 60 * 60 * 1000;

class Slot {
  plate: string | null = null;
  entryTime = 0;

  constructor(public id: number) {}

  isAvailable() {
    return this.plate === null;
  }
}

export class ParkingLot {
  private slots: Slot[] = [];

  // `now` is passed in so tests can control the time.
  constructor(capacity: number, private ratePerHour: number, private now: () => number = () => Date.now()) {
    for (let i = 1; i <= capacity; i++) {
      this.slots.push(new Slot(i));
    }
  }

  park(plate: string): number | null {
    if (this.findSlot(plate) !== null) {
      throw new Error(`${plate} is already parked`);
    }
    const slot = this.slots.find((s) => s.isAvailable());
    if (!slot) {
      return null; // full
    }
    slot.plate = plate;
    slot.entryTime = this.now();
    return slot.id;
  }

  exit(slotId: number): number {
    const slot = this.slots.find((s) => s.id === slotId);
    if (!slot || slot.isAvailable()) {
      throw new Error(`No vehicle in slot ${slotId}`);
    }
    let hours = Math.ceil((this.now() - slot.entryTime) / HOUR);
    if (hours < 1) {
      hours = 1; // pay for at least one hour
    }
    slot.plate = null;
    return hours * this.ratePerHour;
  }

  available(): number {
    return this.slots.filter((s) => s.isAvailable()).length;
  }

  findSlot(plate: string): number | null {
    const slot = this.slots.find((s) => s.plate === plate);
    return slot ? slot.id : null;
  }
}
