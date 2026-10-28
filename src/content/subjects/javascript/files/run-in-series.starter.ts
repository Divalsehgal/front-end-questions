export type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown };

/** Run async tasks one after another (never two at once) and collect every outcome. */
export async function runInSeries<T>(tasks: readonly (() => Promise<T>)[]): Promise<Outcome<T>[]> {
  // your code
}
