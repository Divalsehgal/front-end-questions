import { escapeHtml } from './solution';

test('a script tag becomes plain text', () => {
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('quotes are escaped so input cannot break out of an attribute', () => {
  assert.equal(escapeHtml(`" onmouseover="alert(1)`), '&quot; onmouseover=&quot;alert(1)');
  assert.equal(escapeHtml("it's"), 'it&#39;s');
});

test('& is escaped first, so nothing is escaped twice', () => {
  assert.equal(escapeHtml('Tom & Jerry'), 'Tom &amp; Jerry');
  assert.equal(escapeHtml('&lt;'), '&amp;lt;');
});

test('normal text is unchanged', () => {
  assert.equal(escapeHtml('Hello Dival'), 'Hello Dival');
  assert.equal(escapeHtml(''), '');
});
