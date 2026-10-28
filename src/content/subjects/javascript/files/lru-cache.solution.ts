// A Map remembers insertion order, so its first key is always the least recently used.
// On every get or put we delete the key and set it again, which moves it to the end.
export class LRUCache<K, V> {
  private map = new Map<K, V>();

  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      return undefined;
    }
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value); // now the most recent
    return value;
  }

  put(key: K, value: V): void {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value as K;
      this.map.delete(oldestKey);
    }
  }

  get size(): number {
    return this.map.size;
  }
}
