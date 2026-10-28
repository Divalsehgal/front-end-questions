// Decorator: wrap a function to add behaviour without changing it.
export function withLogging<A extends unknown[], R>(fn: (...args: A) => R, name: string, log: (line: string) => void): (...args: A) => R {
  return function (this: unknown, ...args: A) {
    const result = fn.apply(this, args);
    log(`${name}(${args.join(', ')}) → ${result}`);
    return result;
  };
}

export function withRetry<A extends unknown[], R>(fn: (...args: A) => Promise<R>, times: number): (...args: A) => Promise<R> {
  return async function (this: unknown, ...args: A) {
    let lastError: unknown;
    for (let i = 0; i <= times; i++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };
}

// Adapter: turn the shape we get into the shape the rest of the code expects.
export function toMillionsAdapter(city: { city: string; habitants: number }) {
  const millions = Math.floor(city.habitants / 100_000) / 10; // 3,190,000 → 3.1 (cut off, not rounded)
  return { ...city, habitants: millions };
}

// Facade: one simple function that makes all the calls for you.
export function startCar(steps: { checkFuel(): string; checkBattery(): string; startEngine(): string }): string[] {
  const fuel = steps.checkFuel();
  const battery = steps.checkBattery();
  const engine = steps.startEngine();
  return [fuel, battery, engine];
}
