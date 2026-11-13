// The shape of src/generated/architecture.json (written by scripts/generate-architecture.mjs).
// The file is parsed once here, so a generator change that breaks the shape fails loudly at import
// (and in the tests) instead of rendering a half-empty diagram.
import { z } from 'zod';
import raw from '../generated/architecture.json';

export const NODE_TYPES = ['frontend', 'backend', 'external', 'data'] as const;
export const TIERS = ['client', 'compute', 'data'] as const;

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(NODE_TYPES),
  tier: z.enum(TIERS),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({ label: z.string().min(1), description: z.string().min(1) }),
});

const edgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string(),
  animated: z.boolean().optional(),
  curvature: z.number().optional(),
});

export const architectureSchema = z
  .object({ title: z.string().min(1), subtitle: z.string(), nodes: z.array(nodeSchema), edges: z.array(edgeSchema) })
  .superRefine(({ nodes, edges }, ctx) => {
    const ids = new Set<string>();
    for (const n of nodes) {
      if (ids.has(n.id)) ctx.addIssue({ code: 'custom', message: `Duplicate node id "${n.id}"` });
      ids.add(n.id);
    }
    const edgeIds = new Set<string>();
    for (const e of edges) {
      if (edgeIds.has(e.id)) ctx.addIssue({ code: 'custom', message: `Duplicate edge id "${e.id}"` });
      edgeIds.add(e.id);
      for (const end of [e.source, e.target]) if (!ids.has(end)) ctx.addIssue({ code: 'custom', message: `Edge "${e.id}" points at missing node "${end}"` });
    }
  });

export type Architecture = z.infer<typeof architectureSchema>;
export type ArchNode = Architecture['nodes'][number];
export type ArchEdge = Architecture['edges'][number];
export type NodeType = ArchNode['type'];
export type Tier = ArchNode['tier'];

export const ARCHITECTURE: Architecture = architectureSchema.parse(raw);
