/**
 * A config singleton.
 * - Config.getInstance() always returns the same object
 * - `new Config()` from outside must not create a second instance (throw)
 * - get(key) / set(key, value) store settings
 * - Config.resetForTests() clears the instance (singletons are hard to test: say why!)
 */
export class Config {
  static getInstance(): Config {
    // your code
  }
  static resetForTests(): void {
    // your code
  }
  get(key: string): unknown {
    // your code
  }
  set(key: string, value: unknown): void {
    // your code
  }
}
