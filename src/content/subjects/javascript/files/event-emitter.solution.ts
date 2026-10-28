// Events typed as void take no payload. Every other event takes exactly one.
type Args<P> = [P] extends [void] ? [] : [P];
type Listener<P> = (...args: Args<P>) => void;

export class Emitter<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<Function>>();

  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
    }
  }

  once<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): () => void {
    const unsubscribe = this.on(event, (...args) => {
      unsubscribe();
      listener(...args);
    });
    return unsubscribe;
  }

  emit<K extends keyof EventMap>(event: K, ...args: Args<EventMap[K]>): void {
    const set = this.listeners.get(event);
    if (!set) {
      return;
    }
    // Copy first: a listener that removes itself must not make us skip the next one.
    const copy = Array.from(set);
    for (const listener of copy) {
      listener(...args);
    }
  }
}
