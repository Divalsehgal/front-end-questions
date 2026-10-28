import { connections, nodesByTier, TIER_INFO, TYPE_LABEL } from './model';
import { TYPE_ACCENT, TYPE_ICON } from './typeStyle';
import type { Architecture } from './schema';

/**
 * The diagram as plain HTML: one <details> card per tier, each part with its description and where
 * it sends things. Shown on phones, during the prerender and until the canvas has loaded.
 */
export function TierList({ architecture }: Readonly<{ architecture: Architecture }>) {
  return (
    <div className="space-y-3" data-testid="architecture-tiers">
      {nodesByTier(architecture).map(({ tier, nodes }) => (
        <details key={tier} open className="group rounded-lg border border-line bg-surface">
          <summary className="flex cursor-pointer items-baseline gap-2 px-5 py-3 select-none">
            <span className="font-semibold">{TIER_INFO[tier].title}</span>
            <span className="font-mono text-xs text-text-muted">{nodes.length}</span>
            <span className="ml-auto text-sm text-text-muted">{TIER_INFO[tier].blurb}</span>
          </summary>
          <ul className="divide-y divide-line border-t border-line" aria-label={`${TIER_INFO[tier].title} parts`}>
            {nodes.map((node) => {
              const Icon = TYPE_ICON[node.type];
              const { outgoing } = connections(architecture, node.id);
              return (
                <li key={node.id} data-type={node.type} className={`border-t-2 border-t-transparent px-5 py-4 ${TYPE_ACCENT}`}>
                  <h3 className="flex items-center gap-2 font-medium">
                    <Icon size={16} aria-hidden data-icon="" />
                    {node.data.label}
                    <span className="font-mono text-[11px] font-normal tracking-wide text-text-muted uppercase">{TYPE_LABEL[node.type]}</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-text-muted [overflow-wrap:anywhere]">{node.data.description}</p>
                  {outgoing.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-sm" aria-label={`${node.data.label} connects to`}>
                      {outgoing.map(({ edge, node: to }) => (
                        <li key={edge.id}>
                          <span aria-hidden>→ </span>
                          <span className="font-medium">{to.data.label}</span>
                          {edge.label && <span className="text-text-muted">: {edge.label}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );
}
