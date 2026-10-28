// A small, hand-written architecture for component tests, plus the jsdom stand-ins React Flow needs
// to measure and draw nodes (no layout engine in jsdom).
import { vi } from 'vitest';
import type { Architecture } from '../architecture/schema';

export const fixture: Architecture = {
  title: 'Test architecture',
  subtitle: '4 parts',
  nodes: [
    { id: 'spa', type: 'frontend', tier: 'client', position: { x: 0, y: 0 }, data: { label: 'React SPA', description: 'The app.' } },
    { id: 'worker', type: 'backend', tier: 'compute', position: { x: -130, y: 200 }, data: { label: 'Worker', description: 'Runs code.' } },
    { id: 'cdn', type: 'external', tier: 'compute', position: { x: 130, y: 200 }, data: { label: 'CDN', description: 'Hosts files.' } },
    { id: 'db', type: 'data', tier: 'data', position: { x: 0, y: 400 }, data: { label: 'IndexedDB', description: 'Stores progress.' } },
  ],
  edges: [
    { id: 'spa->worker', source: 'spa', target: 'worker', label: 'posts code', animated: true, curvature: 0.5 },
    { id: 'worker->spa', source: 'worker', target: 'spa', label: 'returns results', curvature: -0.5 },
    { id: 'spa->db', source: 'spa', target: 'db', label: '' },
    { id: 'spa->cdn', source: 'spa', target: 'cdn', label: 'fetches' },
  ],
};

class ResizeObserverStub {
  constructor(private readonly callback: ResizeObserverCallback) {}
  // Like the real one, reports after layout (here: the next task), once React Flow has mounted its viewport.
  observe(target: Element) {
    setTimeout(() =>
      this.callback([{ target, contentRect: { width: 800, height: 560 } } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver),
    );
  }
  unobserve() {}
  disconnect() {}
}

class DOMMatrixReadOnlyStub {
  m22: number;
  constructor(transform?: string) {
    const scale = /scale\(([\d.]+)\)/.exec(transform ?? '')?.[1];
    this.m22 = scale === undefined ? 1 : Number(scale);
  }
}

/** Gives React Flow the browser APIs it measures with (as its own testing guide recommends). */
export function mockReactFlowDom() {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  vi.stubGlobal('DOMMatrixReadOnly', DOMMatrixReadOnlyStub);
  Object.defineProperties(HTMLElement.prototype, {
    offsetHeight: { configurable: true, get: () => 40 },
    offsetWidth: { configurable: true, get: () => 200 },
  });
  (SVGElement.prototype as unknown as { getBBox: () => DOMRect }).getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 }) as DOMRect;
}
