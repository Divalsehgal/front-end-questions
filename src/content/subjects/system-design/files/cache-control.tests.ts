import { cacheControlFor } from './solution';

const FOREVER = 'public, max-age=31536000, immutable';

test('content-hashed build assets are cached for a year, immutable', () => {
  assert.equal(cacheControlFor('/assets/index-BFP5p68h.js'), FOREVER);
  assert.equal(cacheControlFor('/assets/index-CN3qP5RL.css'), FOREVER);
  assert.equal(cacheControlFor('/assets/ArchitectureDiagram-4lVQVqPt.js'), FOREVER);
  assert.equal(cacheControlFor('/assets/inter-latin-Dk3a-9_x.woff2'), FOREVER);
});

test('HTML and routes are stored but revalidated on every use', () => {
  assert.equal(cacheControlFor('/'), 'no-cache');
  assert.equal(cacheControlFor('/index.html'), 'no-cache');
  assert.equal(cacheControlFor('/q/react/use-memo/'), 'no-cache');
});

test('unhashed files are not cached forever: their URL survives deploys', () => {
  assert.equal(cacheControlFor('/favicon.svg'), 'no-cache');
  assert.equal(cacheControlFor('/manifest.webmanifest'), 'no-cache');
  assert.equal(cacheControlFor('/assets/logo.png'), 'no-cache');
});

test('API responses are never stored', () => {
  assert.equal(cacheControlFor('/api/cart'), 'no-store');
  assert.equal(cacheControlFor('/api'), 'no-store');
});

test('only /api itself is an API path, not anything that starts with the letters', () => {
  assert.equal(cacheControlFor('/apiary/'), 'no-cache');
});
