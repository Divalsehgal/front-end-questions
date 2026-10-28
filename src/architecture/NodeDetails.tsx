import { X } from 'lucide-react';
import { IconButton } from '../ui';
import { connections, TIER_INFO, TYPE_LABEL, type Link } from './model';
import { TYPE_ICON } from './typeStyle';
import type { Architecture, ArchNode } from './schema';

function Links({ title, links, arrow }: Readonly<{ title: string; links: Link[]; arrow: string }>) {
  if (!links.length) return null;
  return (
    <>
      <h3 className="mt-4 font-mono text-[11px] font-medium tracking-widest text-text-muted uppercase">{title}</h3>
      <ul className="mt-1 space-y-1 text-sm">
        {links.map(({ edge, node }) => (
          <li key={edge.id}>
            <span aria-hidden>{arrow} </span>
            <span className="font-medium">{node.data.label}</span>
            {edge.label && <span className="text-text-muted">: {edge.label}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

/** What one part does and what it talks to. Opened by clicking a node on the canvas. */
export function NodeDetails({ architecture, node, onClose }: Readonly<{ architecture: Architecture; node: ArchNode; onClose: () => void }>) {
  const Icon = TYPE_ICON[node.type];
  const { incoming, outgoing } = connections(architecture, node.id);
  return (
    <section
      aria-labelledby="architecture-detail-title"
      className="absolute top-3 right-3 z-10 max-h-[calc(100%-1.5rem)] w-80 overflow-auto rounded-lg border border-line bg-surface p-4 shadow-lg"
    >
      <div className="flex items-start gap-2">
        <Icon size={18} aria-hidden className="mt-0.5 shrink-0 text-brand-strong" />
        <h2 id="architecture-detail-title" className="min-w-0 flex-1 font-semibold">
          {node.data.label}
        </h2>
        <IconButton label="Close details" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </div>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 text-sm">
        <dt className="text-text-muted">Type</dt>
        <dd>{TYPE_LABEL[node.type]}</dd>
        <dt className="text-text-muted">Tier</dt>
        <dd>{TIER_INFO[node.tier].title}</dd>
      </dl>
      <p className="mt-3 text-sm leading-6 [overflow-wrap:anywhere]">{node.data.description}</p>
      <Links title="Receives from" links={incoming} arrow="←" />
      <Links title="Sends to" links={outgoing} arrow="→" />
    </section>
  );
}
