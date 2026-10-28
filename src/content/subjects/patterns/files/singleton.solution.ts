// In JS a module that exports one object is already a singleton. A class like this
// is useful when you want to create it lazily, the first time someone asks for it.
export class Config {
  private static instance: Config | null = null;
  private values: Record<string, unknown> = {};

  constructor() {
    if (Config.instance) {
      throw new Error('Use Config.getInstance()');
    }
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  static resetForTests(): void {
    Config.instance = null;
  }

  get(key: string): unknown {
    return this.values[key];
  }

  set(key: string, value: unknown): void {
    this.values[key] = value;
  }
}
