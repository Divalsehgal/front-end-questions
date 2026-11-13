'use client';

import { root, type Node } from '../../dsa/data';
import { Card, SectionTitle } from '../../ui';

const categories = root.children ?? [];

/** Every pattern on one sheet: when to spot it, the one-line idea, the template and its questions. */
export function DsaPatterns() {
  return categories.map((cat) => (
    <section key={cat.name} aria-labelledby={`cat-${cat.name}`}>
      <SectionTitle id={`cat-${cat.name}`}>
        {cat.name} <span className="normal-case">({cat.children?.length} patterns)</span>
      </SectionTitle>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(cat.children ?? []).map((p: Node) => (
          <Card key={p.name} className="flex flex-col gap-1.5 p-4">
            <h3 className="font-semibold">{p.name}</h3>
            {p.spot && <p className="text-sm text-text-muted">{p.spot}</p>}
            {p.memory && <p className="font-mono text-xs text-text-main">{p.memory}</p>}
            {p.code && <pre className="mt-1 rounded-lg bg-code px-3 py-2 font-mono text-xs whitespace-pre-wrap">{p.code}</pre>}
            {p.children && <p className="mt-auto pt-1.5 text-xs text-text-muted">{p.children.map((q) => q.name).join(', ')}</p>}
          </Card>
        ))}
      </div>
    </section>
  ));
}
