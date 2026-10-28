import { useState } from 'react';

// Durations in ms for each light. The order is red → green → yellow → red.
const CONFIG = {
  red: { duration: 4000, next: 'green' },
  green: { duration: 3000, next: 'yellow' },
  yellow: { duration: 1000, next: 'red' },
} as const;

type Light = keyof typeof CONFIG;

export default function TrafficLight() {
  // your code
  return <div className="p-6">Start building here</div>;
}
