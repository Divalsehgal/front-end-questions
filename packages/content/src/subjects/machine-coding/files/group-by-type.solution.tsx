const RAW_DATA = [
  "hello",
  101,
  { name: "Ann", role: "admin" },
  [1, 2, 3],
  "world",
  42,
  null,
  { id: 1 },
  true,
  [10, 20],
  undefined,
  () => "hi"
];

// Groups appear in the order their type is first seen (object keys keep insertion order).
function groupByType(collection: unknown[]): Record<string, unknown[]> {
  return collection.reduce<Record<string, unknown[]>>((acc, item) => {
    let type: string = typeof item;
    if (item === null) type = "null"; // typeof null is "object"
    else if (Array.isArray(item)) type = "array"; // typeof [] is "object" too
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
}

// JSON.stringify returns undefined for undefined and functions, so fall back to String().
const show = (value: unknown) => JSON.stringify(value) ?? String(value);

export default function GroupByType() {
  const grouped = groupByType(RAW_DATA);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-text-main">Group by type</h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr]">
        <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface p-5">
          <h2 className="text-sm font-semibold text-text-muted">Input</h2>
          <ol className="space-y-1.5">
            {RAW_DATA.map((item, i) => (
              <li key={i} className="flex gap-3 rounded-lg bg-muted px-3 py-2">
                <span className="w-4 text-xs text-text-muted">{i + 1}</span>
                <code className="flex-1 truncate text-xs text-text-main">{show(item)}</code>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-muted">Groups</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="space-y-3 rounded-2xl border border-border-subtle bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-main">{type}</h3>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-text-muted">{items.length}</span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="rounded-lg bg-muted px-3 py-2">
                      <code className="block text-xs break-all text-text-main">{show(item)}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
