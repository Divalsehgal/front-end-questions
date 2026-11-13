// Hosts the server is allowed to call on a user's behalf.
export const ALLOWED_HOSTS = ['api.stripe.com', 'images.example.com'];

export function isSafeUrl(input: string): boolean {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return false; // not a valid absolute URL
  }

  if (url.protocol !== 'https:') return false;

  // Compare the parsed hostname exactly. A string check like input.includes('api.stripe.com')
  // would let through https://api.stripe.com.evil.com or https://evil.com/?api.stripe.com
  return ALLOWED_HOSTS.includes(url.hostname);
}
