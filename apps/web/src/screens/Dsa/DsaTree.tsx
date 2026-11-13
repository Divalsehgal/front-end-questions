'use client';
import { root, type Node } from '@fe-grind/dsa/data';
import { toggleDone, useDone } from '@fe-grind/dsa/done';
import { cn } from '@fe-grind/ui/lib';
import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { DetailPanel } from './DetailPanel';
import './dsa.css';

const leaves = (n: Node): Node[] => (n.url ? [n] : (n.children ?? []).flatMap(leaves));

/** Keeps a node if its name matches (with its whole subtree) or any descendant matches. */
export const filterTree = (n: Node, q: string): Node | null => {
  if (!q || n.name.toLowerCase().includes(q)) return n;
  const children = (n.children ?? []).map((c) => filterTree(c, q)).filter((c): c is Node => !!c);
  return children.length ? { ...n, children } : null;
};

/** Accordion: opening keeps only this path's ancestors open; closing also closes its descendants. */
export function toggleOpen(open: Set<string>, path: string) {
  if (open.has(path)) return new Set([...open].filter((p) => p !== path && !p.startsWith(path + '/')));
  return new Set([...open].filter((p) => path.startsWith(p + '/')).concat(path));
}

const NODE = 'flex min-w-40 max-w-72 shrink-0 flex-col gap-1 rounded-xl border bg-surface px-3.5 py-2.5 text-left text-sm shadow-sm';

type TreeState = {
  done: ReadonlySet<string>;
  selected: Node | null;
  select: (n: Node) => void;
  isOpen: (path: string) => boolean;
  toggle: (path: string) => void;
};

function Question({ n, t }: Readonly<{ n: Node; t: TreeState }>) {
  const ticked = t.done.has(n.name);
  return (
    <div className={cn(NODE, 'flex-row items-start gap-2.5', t.selected === n ? 'border-brand ring-2 ring-brand-soft' : 'border-line')}>
      <input
        type="checkbox"
        aria-label={`Solved ${n.name}`}
        checked={ticked}
        onChange={() => toggleDone(n.name)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
      />
      <button type="button" className="flex flex-col gap-1 text-left" onClick={() => t.select(n)}>
        <span className={cn('font-medium', ticked && 'text-text-muted line-through decoration-brand')}>{n.name}</span>
        {n.memory && <span className="font-mono text-xs text-text-muted">{n.memory}</span>}
      </button>
    </div>
  );
}

function Group({ n, path, t }: Readonly<{ n: Node; path: string; t: TreeState }>) {
  const kids = n.children ?? [];
  const open = kids.length > 0 && t.isOpen(path);
  const all = leaves(n);
  const solved = all.filter((x) => t.done.has(x.name)).length;
  const isRoot = path === 'DSA';
  return (
    <button
      type="button"
      className={cn(
        NODE,
        'transition-colors hover:border-brand',
        isRoot && 'min-w-0 bg-text-main text-canvas',
        t.selected === n || open || isRoot ? 'border-brand' : 'border-line',
        t.selected === n && 'ring-2 ring-brand-soft',
      )}
      aria-expanded={kids.length ? open : undefined}
      onClick={() => {
        if (kids.length) t.toggle(path);
        if (n.spot || n.steps || n.code) t.select(n);
      }}
    >
      <span className="flex items-center gap-2.5">
        <span className="font-semibold">{n.name}</span>
        {all.length > 0 && (
          <span className={cn('ml-auto font-mono text-xs tabular-nums', !isRoot && (solved === all.length ? 'text-brand-strong' : 'text-text-muted'))}>
            {solved}/{all.length}
          </span>
        )}
        {kids.length > 0 && <ChevronRight size={14} aria-hidden className={cn('shrink-0 transition-transform', open && 'rotate-90')} />}
      </span>
      {n.memory && <span className="font-mono text-xs text-text-muted">{n.memory}</span>}
    </button>
  );
}

function Branch({ n, path, t }: Readonly<{ n: Node; path: string; t: TreeState }>) {
  const kids = n.children ?? [];
  return (
    <div className="flex items-start">
      {n.url ? <Question n={n} t={t} /> : <Group n={n} path={path} t={t} />}
      {kids.length > 0 && t.isOpen(path) && (
        <ul className="dsa-children">
          {kids.map((c) => (
            <li key={c.name} className="dsa-item">
              <Branch n={c} path={`${path}/${c.name}`} t={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Category, then pattern, then question: one branch open at a time, unless you filter. */
export function DsaTree() {
  const done = useDone();
  const [open, setOpen] = useState(() => new Set(['DSA']));
  const [selected, setSelected] = useState<Node | null>(null);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const tree = filterTree(root, q);
  const t: TreeState = { done, selected, select: setSelected, isOpen: (p) => !!q || open.has(p), toggle: (p) => setOpen(toggleOpen(open, p)) };

  return (
    <>
      <label className="relative mb-6 flex w-full max-w-xs items-center">
        <Search size={15} aria-hidden className="pointer-events-none absolute left-3 text-text-muted" />
        <input
          type="search"
          placeholder="Filter questions or patterns"
          aria-label="Filter questions or patterns"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-line-strong bg-surface py-2 pr-3 pl-9 text-sm placeholder:text-text-muted"
        />
      </label>
      <div className="dsa-tree overflow-x-auto pb-60">
        {tree ? (
          <Branch n={tree} path="DSA" t={t} />
        ) : (
          <p className="py-10 text-text-muted">Nothing matches &ldquo;{query}&rdquo;. Try a pattern name like window or heap.</p>
        )}
      </div>
      {selected && <DetailPanel node={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
