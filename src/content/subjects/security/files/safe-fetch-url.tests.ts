import { isSafeUrl } from './solution';

test('allows https URLs on an allowed host', () => {
  assert.equal(isSafeUrl('https://api.stripe.com/v1/charges'), true);
  assert.equal(isSafeUrl('https://images.example.com/a.png?size=2'), true);
});

test('blocks internal addresses', () => {
  assert.equal(isSafeUrl('http://localhost:5432'), false);
  assert.equal(isSafeUrl('http://169.254.169.254/latest/meta-data'), false);
  assert.equal(isSafeUrl('https://192.168.1.10/admin'), false);
});

test('blocks look-alike hosts', () => {
  assert.equal(isSafeUrl('https://api.stripe.com.evil.com'), false);
  assert.equal(isSafeUrl('https://evil.com/?next=api.stripe.com'), false);
  assert.equal(isSafeUrl('https://api.stripe.com@evil.com'), false);
});

test('blocks other protocols and invalid input', () => {
  assert.equal(isSafeUrl('http://api.stripe.com'), false);
  assert.equal(isSafeUrl('file:///etc/passwd'), false);
  assert.equal(isSafeUrl('not a url'), false);
});
