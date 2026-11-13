import { ParkingLot } from './solution';
const HOUR = 60 * 60 * 1000;
const clockAt = () => {
  let t = 0;
  return { now: () => t, advance: (ms: number) => (t += ms) };
};
test('parks in the lowest free slot and reports full', () => {
  const lot = new ParkingLot(2, 5);
  assert.equal(lot.park('A'), 1);
  assert.equal(lot.park('B'), 2);
  assert.equal(lot.park('C'), null);
  assert.equal(lot.available(), 0);
});
test('fees round up to whole hours, minimum one hour', () => {
  const c = clockAt();
  const lot = new ParkingLot(3, 5, c.now);
  const slot = lot.park('A')!;
  c.advance(2.2 * HOUR);
  assert.equal(lot.exit(slot), 15);
  const s2 = lot.park('B')!;
  c.advance(60 * 1000);
  assert.equal(lot.exit(s2), 5);
});
test('freed slots are reused', () => {
  const lot = new ParkingLot(2, 5);
  lot.park('A');
  lot.park('B');
  lot.exit(1);
  assert.equal(lot.park('C'), 1);
  assert.equal(lot.findSlot('C'), 1);
  assert.equal(lot.findSlot('A'), null);
});
test('invalid operations throw', () => {
  const lot = new ParkingLot(2, 5);
  lot.park('A');
  const throws = (f: () => unknown) => {
    try {
      f();
    } catch {
      return true;
    }
    return false;
  };
  assert.ok(throws(() => lot.park('A')), 'same plate twice');
  assert.ok(throws(() => lot.exit(2)), 'empty slot');
  assert.ok(throws(() => lot.exit(99)), 'unknown slot');
});
