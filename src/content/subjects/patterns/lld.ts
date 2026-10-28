import { codeFiles } from '../../files';
import type { Topic } from '../../types';

const code = codeFiles('patterns', import.meta.glob<string>('./files/*', { query: '?raw', import: 'default', eager: true }));

export const lld: Topic = {
  slug: 'lld',
  title: 'Low-level design',
  questions: [
    {
      kind: 'flashcard',
      id: 'lld-f1',
      title: 'Approaching an LLD question',
      front: 'Walk through how you approach "design a parking lot" in an interview.',
      back: `1. **Clarify** scope: vehicle types? multiple floors? pricing rules? payments?
2. **Nouns → classes**: ParkingLot, Level, Slot, Vehicle, Ticket; **verbs → methods**: park, exit, findSlot.
3. **Responsibilities**: each class owns its state (a Slot knows if it's free; the Lot allocates).
4. **Extension points**: pricing via a **Strategy**, slot/vehicle creation via a **Factory**, display boards via **Observer**.
5. **Testability**: inject the clock and dependencies; avoid hidden globals.
6. Edge cases: full lot, double parking, invalid exits, concurrency.`,
    },
    {
      kind: 'code',
      id: 'parking-lot',
      title: 'Design a parking lot',
      difficulty: 'medium',
      prompt:
        'Implement `ParkingLot` with park, exit (hourly fee, rounded up, minimum 1 hour), available and findSlot. The clock is injected, so the tests control time. Invalid operations throw.',
      ...code('parking-lot'),
    },
  ],
};
