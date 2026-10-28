import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import generated from '../generated/architecture.json';
import { ARCHITECTURE, architectureSchema } from './schema';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SCRIPT = join(ROOT, 'scripts/generate-architecture.mjs');
const COMMITTED = join(ROOT, 'src/generated/architecture.json');
const temp = mkdtempSync(join(tmpdir(), 'architecture-'));
afterAll(() => rmSync(temp, { recursive: true, force: true }));

const run = (...args: string[]) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8' });
const readJson = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'));

describe('generated architecture', () => {
  it('passes the schema, with unique ids and edges between existing nodes', () => {
    expect(architectureSchema.safeParse(generated).success).toBe(true);
    const ids = ARCHITECTURE.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(ARCHITECTURE.edges.map((e) => e.id)).size).toBe(ARCHITECTURE.edges.length);
    for (const e of ARCHITECTURE.edges) expect(ids).toEqual(expect.arrayContaining([e.source, e.target]));
  });

  it('describes this repository from its own files', () => {
    const byId = new Map(ARCHITECTURE.nodes.map((n) => [n.id, n]));
    for (const id of ['spa', 'sandbox', 'prerender', 'vercel', 'localStorage', 'indexedDb', 'content']) expect(byId.has(id)).toBe(true);
    expect(byId.get('spa')?.data.description).toContain('/architecture');
    // Rows are centred: x = (i - (n - 1) / 2) * 260, y by tier.
    for (const tier of ['client', 'compute', 'data'] as const) {
      const row = ARCHITECTURE.nodes.filter((n) => n.tier === tier);
      expect(row.reduce((sum, n) => sum + n.position.x, 0)).toBe(0);
      expect(new Set(row.map((n) => n.position.y)).size).toBeLessThanOrEqual(1);
    }
    // Two-way pairs bend in opposite directions.
    for (const e of ARCHITECTURE.edges.filter((x) => x.curvature !== undefined)) {
      const back = ARCHITECTURE.edges.find((x) => x.source === e.target && x.target === e.source);
      expect(back?.curvature).toBe(-(e.curvature ?? 0));
    }
  });

  it('is up to date, and --check exits 0', () => {
    const result = run('--check');
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('--check exits 1 with a hint when the output is stale or missing', () => {
    const stale = join(temp, 'stale.json');
    writeFileSync(stale, readFileSync(COMMITTED, 'utf8').replace('"React SPA"', '"Renamed"'));
    const result = run('--check', '--out', stale);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('npm run architecture');
    expect(run('--check', '--out', join(temp, 'missing.json')).status).toBe(1);
  });

  it('writes stable output: the same bytes as the committed file, with a trailing newline', () => {
    const out = join(temp, 'fresh.json');
    expect(run('--out', out).status).toBe(0);
    const text = readFileSync(out, 'utf8');
    expect(text).toBe(readFileSync(COMMITTED, 'utf8'));
    expect(text.endsWith('}\n')).toBe(true);
  });

  it('leaves out nodes whose files are missing instead of crashing', () => {
    const empty = join(temp, 'empty');
    mkdirSync(empty);
    expect(run('--root', empty).status).toBe(0);
    const bare = architectureSchema.parse(readJson(join(empty, 'src/generated/architecture.json')));
    expect(bare).toMatchObject({ title: 'App architecture', nodes: [], edges: [] });

    const small = join(temp, 'small');
    mkdirSync(join(small, 'src/runtime'), { recursive: true });
    writeFileSync(join(small, 'package.json'), JSON.stringify({ name: 'tiny', dependencies: { react: '^19.1.0' } }));
    writeFileSync(join(small, 'src/App.tsx'), "const ROUTES = [\n  { index: true, page: 'home' },\n  { path: 'about', page: 'about' },\n];\n");
    writeFileSync(join(small, 'src/runtime/sandbox.worker.ts'), '');
    expect(run('--root', small).status).toBe(0);
    const tiny = architectureSchema.parse(readJson(join(small, 'src/generated/architecture.json')));
    expect(tiny.title).toBe('tiny architecture');
    expect(tiny.nodes.map((n) => n.id)).toEqual(['spa', 'sandbox']);
    expect(tiny.nodes[0].data.description).toContain('React 19.1.0 app routed by react-router-dom ? across 2 routes (/, /about)');
    expect(tiny.edges.map((e) => e.id)).toEqual(['spa->sandbox', 'sandbox->spa']);
  });
});

describe('architectureSchema', () => {
  const node = (id: string) => ({ id, type: 'data', tier: 'data', position: { x: 0, y: 0 }, data: { label: id, description: 'x' } });

  it('rejects duplicate ids and edges to missing nodes', () => {
    const result = architectureSchema.safeParse({
      title: 't',
      subtitle: '',
      nodes: [node('a'), node('a')],
      edges: [
        { id: 'e', source: 'a', target: 'b', label: '' },
        { id: 'e', source: 'a', target: 'a', label: '' },
      ],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toEqual(['Duplicate node id "a"', 'Edge "e" points at missing node "b"', 'Duplicate edge id "e"']);
  });

  it('rejects unknown node types', () => {
    expect(architectureSchema.safeParse({ title: 't', subtitle: '', nodes: [{ ...node('a'), type: 'queue' }], edges: [] }).success).toBe(false);
  });
});
