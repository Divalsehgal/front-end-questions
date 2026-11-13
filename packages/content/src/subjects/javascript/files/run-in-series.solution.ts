export type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown };

export async function runInSeries<T>(tasks: readonly (() => Promise<T>)[]): Promise<Outcome<T>[]> {
  const results: Outcome<T>[] = [];
  for (const task of tasks) {
    try {
      const value = await task(); // await inside the loop, so tasks run one after another
      results.push({ ok: true, value });
    } catch (error) {
      results.push({ ok: false, error });
    }
  }
  return results;
}
