/**
 * Replace every {{key}} in any string inside `template` (deeply, through objects and arrays)
 * with values[key]. Unknown keys become ''. Don't mutate the template.
 */
export function replacePlaceholders<T>(template: T, values: Record<string, string>): T {
  // your code
}
