export function replacePlaceholders<T>(template: T, values: Record<string, string>): T {
  if (Array.isArray(template)) {
    return template.map((item) => replacePlaceholders(item, values)) as T;
  }
  if (typeof template === 'object' && template !== null) {
    const result: any = {};
    for (const key in template) {
      result[key] = replacePlaceholders(template[key], values);
    }
    return result;
  }
  if (typeof template === 'string') {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key: string) => values[key.trim()] ?? '') as T;
  }
  return template;
}
