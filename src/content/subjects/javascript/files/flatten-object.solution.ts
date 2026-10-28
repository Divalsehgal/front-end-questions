export function flattenObject(obj: Record<string, unknown>, parentKey = ''): Record<string, unknown> {
  let result: Record<string, unknown> = {};
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];
    // typeof null is 'object' too, and a Date is a value, not something to open up.
    if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      result = { ...result, ...flattenObject(value as Record<string, unknown>, newKey) };
    } else {
      result[newKey] = value;
    }
  }
  return result;
}
