// The interactive canvas. Only ever loaded through React.lazy (see ArchitectureView), so React Flow and
// its stylesheet stay out of every other chunk.
import '@xyflow/react/dist/style.css';
import { Background, Controls, MarkerType, ReactFlow, type BuiltInEdge, type NodeTypes } from '@xyflow/react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { useTheme } from '../state/theme';
import { ArchitectureNode, SelectedNodeContext, type FlowNode } from './ArchitectureNode';
import { NodeDetails } from './NodeDetails';
import type { Architecture } from './schema';

const nodeTypes: NodeTypes = { architecture: ArchitectureNode };
const ARROW_FALLBACK = '#71717a';

function subscribeToThemeClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/**
 * A theme colour as a literal value. Edge markers take their colour inline, which CSS can't override,
 * so it is read from the custom property and re-read whenever the `dark` class on <html> changes.
 */
export function useCssColor(name: string, fallback: string) {
  return useSyncExternalStore(
    subscribeToThemeClass,
    () => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback,
    () => fallback,
  );
}

export function ArchitectureDiagram({ architecture }: Readonly<{ architecture: Architecture }>) {
  const theme = useTheme();
  const arrow = useCssColor('--text-muted', ARROW_FALLBACK);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = architecture.nodes.find((n) => n.id === selectedId);

  const nodes = useMemo<FlowNode[]>(
    () =>
      architecture.nodes.map((n) => ({
        id: n.id,
        type: 'architecture',
        position: n.position,
        data: { label: n.data.label, description: n.data.description, kind: n.type, tier: n.tier },
      })),
    [architecture],
  );

  const edges = useMemo<BuiltInEdge[]>(
    () =>
      architecture.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'default',
        label: e.label,
        animated: e.animated,
        pathOptions: e.curvature === undefined ? undefined : { curvature: e.curvature },
        markerEnd: { type: MarkerType.ArrowClosed, color: arrow, width: 16, height: 16 },
        style: { stroke: arrow, strokeWidth: 1.25 },
        labelStyle: { fill: 'var(--text-muted)', fontSize: 11 },
        labelBgStyle: { fill: 'var(--surface)' },
        labelBgPadding: [4, 2],
      })),
    [architecture, arrow],
  );

  return (
    <div className="relative h-[560px] overflow-hidden rounded-lg border border-line bg-surface" data-testid="architecture-canvas">
      <SelectedNodeContext value={selectedId}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          colorMode={theme}
          style={{ background: 'transparent' }}
          fitView
          minZoom={0.15}
          // Read-only, and the page keeps scrolling under the wheel: zoom with pinch or the buttons, pan by dragging.
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnPinch
          panOnDrag
          zoomOnDoubleClick={false}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          aria-label={`${architecture.title} diagram`}
        >
          <Background gap={24} color="var(--border)" bgColor="transparent" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </SelectedNodeContext>
      {selected && <NodeDetails architecture={architecture} node={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
