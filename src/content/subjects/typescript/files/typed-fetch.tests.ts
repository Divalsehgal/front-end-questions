import { fetchJson } from './solution';

const respond = (status: number, body: unknown) => async (_url: string, init?: RequestInit) => {
  calls.push(init);
  return new Response(JSON.stringify(body), { status });
};
let calls: (RequestInit | undefined)[] = [];

test('returns parsed JSON for OK responses', async () => {
  calls = [];
  (globalThis as any).fetch = respond(200, { id: 1, title: 'Hi' });
  assert.deepEqual(await fetchJson('/posts/1'), { id: 1, title: 'Hi' });
});

test('throws with the status for non-OK responses', async () => {
  (globalThis as any).fetch = respond(404, { error: 'nope' });
  await assert.rejects(fetchJson('/missing'), /404/);
});

test('passes init through (e.g. an AbortSignal)', async () => {
  calls = [];
  (globalThis as any).fetch = respond(200, {});
  const controller = new AbortController();
  await fetchJson('/x', { signal: controller.signal });
  assert.equal(calls[0]?.signal, controller.signal);
});
