import { TIERS, type ArchEdge, type Architecture, type ArchNode, type NodeType, type Tier } from './schema';

/** How each tier is introduced to a newcomer. */
export const TIER_INFO: Record<Tier, { title: string; blurb: string }> = {
  client: { title: 'Client', blurb: 'What runs in the learner’s browser tab.' },
  compute: { title: 'Compute and services', blurb: 'Where code runs and pages are built, served and checked.' },
  data: { title: 'Data', blurb: 'Where questions and progress live.' },
};

export const TYPE_LABEL: Record<NodeType, string> = {
  frontend: 'Frontend',
  backend: 'Runs code',
  external: 'External service',
  data: 'Data store',
};

/** Non-empty tiers in order, each with its nodes in diagram order. */
export const nodesByTier = (a: Architecture) =>
  TIERS.map((tier) => ({ tier, nodes: a.nodes.filter((n) => n.tier === tier) })).filter((t) => t.nodes.length > 0);

export type Link = { edge: ArchEdge; node: ArchNode };

/** The edges into and out of a node, each with the node at its other end. */
export function connections(a: Architecture, id: string): { incoming: Link[]; outgoing: Link[] } {
  const byId = new Map(a.nodes.map((n) => [n.id, n]));
  const link = (edge: ArchEdge, other: string) => {
    const node = byId.get(other);
    return node ? [{ edge, node }] : [];
  };
  return {
    incoming: a.edges.filter((e) => e.target === id).flatMap((e) => link(e, e.source)),
    outgoing: a.edges.filter((e) => e.source === id).flatMap((e) => link(e, e.target)),
  };
}
