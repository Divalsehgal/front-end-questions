import { ExternalLink, X } from 'lucide-react';
import { IconButton } from '../../ui';
import type { Node } from '../../dsa/data';

/** A floating card with the selected node's notes: over the page, so opening it moves nothing. */
export function DetailPanel({ node, onClose }: Readonly<{ node: Node; onClose: () => void }>) {
  return (
    <aside
      aria-label={node.name}
      className="fixed right-5 bottom-5 z-20 max-h-[calc(100dvh-6.5rem)] w-[min(400px,calc(100vw-2rem))] overflow-auto rounded-xl border border-line bg-surface px-5 py-4 shadow-lg"
    >
      <IconButton label="Close" className="absolute top-3 right-3" onClick={onClose}>
        <X size={16} aria-hidden />
      </IconButton>
      <h2 className="mr-8 mb-2 text-lg font-semibold">
        {node.url ? (
          <a href={node.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline">
            {node.name}
            <ExternalLink size={15} aria-hidden className="text-brand" />
            <span className="sr-only">(opens LeetCode in a new tab)</span>
          </a>
        ) : (
          node.name
        )}
      </h2>
      {node.spot && <p className="my-1.5 text-text-muted">{node.spot}</p>}
      {node.memory && <p className="my-1.5 font-mono text-sm text-brand-strong">{node.memory}</p>}
      {node.steps && (
        <ol className="my-2.5 list-decimal space-y-1 pl-5 text-sm">
          {node.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
      {node.code && <pre className="mt-3 rounded-lg bg-code px-3.5 py-3 font-mono text-xs whitespace-pre-wrap">{node.code}</pre>}
    </aside>
  );
}
