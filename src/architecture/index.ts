// Public surface of the architecture feature. ArchitectureDiagram (React Flow) is deliberately not
// exported: it is only reached through ArchitectureView's lazy import.
export { ArchitectureView } from './ArchitectureView';
export { ArchitectureWidget } from './ArchitectureWidget';
export { ARCHITECTURE, architectureSchema, type Architecture } from './schema';
