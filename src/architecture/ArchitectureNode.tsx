import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { createContext, useContext } from 'react';
import { cn } from '../ui/lib';
import { TYPE_LABEL } from './model';
import { TYPE_ACCENT, TYPE_ICON } from './typeStyle';
import type { NodeType, Tier } from './schema';

export type FlowNodeData = { label: string; description: string; kind: NodeType; tier: Tier };
export type FlowNode = Node<FlowNodeData, 'architecture'>;

/**
 * The node whose details are open. Read from context rather than node data, so selecting doesn't hand
 * React Flow new node objects (which would drop their measured sizes and re-measure every node).
 */
export const SelectedNodeContext = createContext<string | null>(null);

const HANDLE = 'h-2! w-2! min-h-0! min-w-0! border-0! bg-line-strong!';

/**
 * The one node component for every type: the icon and the accent come from `data-type`. The label is a
 * button so keyboard users can open the details too; its click bubbles to React Flow's onNodeClick.
 */
export function ArchitectureNode({ id, data }: NodeProps<FlowNode>) {
  const Icon = TYPE_ICON[data.kind];
  const active = useContext(SelectedNodeContext) === id;
  return (
    <div
      data-type={data.kind}
      className={cn(
        'w-[200px] rounded-lg border border-t-4 border-line bg-surface px-3 py-2 text-text-main shadow-sm transition-shadow',
        TYPE_ACCENT,
        active && 'ring-2 ring-focus',
      )}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} className={HANDLE} />
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 rounded text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label={`${data.label}: show details`}
        aria-pressed={active}
      >
        <Icon size={16} aria-hidden data-icon="" className="shrink-0" />
        <span className="truncate">{data.label}</span>
      </button>
      <p className="mt-0.5 font-mono text-[10px] tracking-wide text-text-muted uppercase">{TYPE_LABEL[data.kind]}</p>
      <Handle type="source" position={Position.Bottom} isConnectable={false} className={HANDLE} />
    </div>
  );
}
