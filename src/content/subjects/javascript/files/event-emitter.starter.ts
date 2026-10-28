// Replace every `any` with types derived from EventMap.
export class Emitter<EventMap extends Record<string, unknown>> {
  on(event: any, listener: any): () => void {
    // your code
  }
  off(event: any, listener: any): void {
    // your code
  }
  once(event: any, listener: any): () => void {
    // your code
  }
  emit(event: any, ...args: any[]): void {
    // your code
  }
}
