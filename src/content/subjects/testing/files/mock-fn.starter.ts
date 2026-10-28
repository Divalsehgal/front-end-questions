/**
 * Re-implement the core of jest.fn() / vi.fn():
 * - calling the mock records args in mock.calls and return values in mock.results ({ type: 'return' | 'throw', value })
 * - mockImplementation(fn), mockReturnValue(v), mockReturnValueOnce(v) (once-values are used first, in order)
 * - mockClear() resets calls/results but keeps the implementation; mockReset() resets everything
 * - mockResolvedValue(v) is shorthand for an implementation returning Promise.resolve(v)
 * Every configuration method returns the mock itself, for chaining.
 */
export function mockFn(impl?: (...args: any[]) => any): any {
  // your code
}
