type Result = { type: 'return' | 'throw'; value: unknown };

export function mockFn(impl?: (...args: any[]) => any): any {
  let implementation = impl;
  let onceValues: unknown[] = [];
  const calls: unknown[][] = [];
  const results: Result[] = [];

  const mock: any = function (this: unknown, ...args: unknown[]) {
    calls.push(args);
    try {
      let value;
      if (onceValues.length > 0) {
        value = onceValues.shift(); // once-values are used first, in order
      } else if (implementation) {
        value = implementation.apply(this, args);
      }
      results.push({ type: 'return', value });
      return value;
    } catch (error) {
      results.push({ type: 'throw', value: error });
      throw error;
    }
  };

  mock.mock = { calls, results };

  mock.mockImplementation = (fn: (...args: any[]) => any) => {
    implementation = fn;
    return mock;
  };
  mock.mockReturnValue = (value: unknown) => mock.mockImplementation(() => value);
  mock.mockResolvedValue = (value: unknown) => mock.mockImplementation(() => Promise.resolve(value));
  mock.mockReturnValueOnce = (value: unknown) => {
    onceValues.push(value);
    return mock;
  };

  // mockClear forgets the calls. mockReset also forgets the implementation.
  mock.mockClear = () => {
    calls.length = 0; // empty the same arrays, so mock.mock.calls stays the same object
    results.length = 0;
    return mock;
  };
  mock.mockReset = () => {
    mock.mockClear();
    implementation = undefined;
    onceValues = [];
    return mock;
  };

  return mock;
}
