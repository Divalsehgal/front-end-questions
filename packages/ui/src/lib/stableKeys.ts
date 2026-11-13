/**
 * React keys derived from content rather than position: each item's key is `toKey(item)`, with a
 * `#n` suffix on repeats so duplicates (two identical lines, two empty cells) stay unique.
 * Keys only change when the content does, so a reordered or edited list keeps the right elements.
 */
export function withStableKeys<T>(items: readonly T[], toKey: (item: T) => string = String): { item: T; key: string }[] {
  const used = new Set<string>();
  return items.map((item) => {
    const base = toKey(item);
    let key = base;
    for (let n = 1; used.has(key); n++) key = `${base}#${n}`;
    used.add(key);
    return { item, key };
  });
}
