import { Cloud, Cpu, Database, Monitor, type LucideIcon } from 'lucide-react';
import type { NodeType } from './schema';

/** One icon per node type, shared by the canvas, the tier list and the detail panel. */
export const TYPE_ICON: Record<NodeType, LucideIcon> = {
  frontend: Monitor,
  backend: Cpu,
  external: Cloud,
  data: Database,
};

/**
 * Accent per node type, picked with `data-type` so one component styles every type. Semantic tokens
 * only, so both themes work: brand for our own UI, secondary for code we run, success for data.
 */
export const TYPE_ACCENT = [
  'data-[type=frontend]:border-t-brand data-[type=frontend]:[&_[data-icon]]:text-brand-strong',
  'data-[type=backend]:border-t-secondary data-[type=backend]:[&_[data-icon]]:text-secondary-strong',
  'data-[type=external]:border-t-line-strong data-[type=external]:[&_[data-icon]]:text-text-muted',
  'data-[type=data]:border-t-success data-[type=data]:[&_[data-icon]]:text-success',
].join(' ');
