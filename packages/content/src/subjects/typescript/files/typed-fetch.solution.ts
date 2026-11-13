// The <T> only says what we expect back. Nothing checks it at runtime.
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const data = await response.json();
  return data as T;
}
