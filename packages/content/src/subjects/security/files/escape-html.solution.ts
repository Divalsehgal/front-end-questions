const replacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  let result = '';
  for (const char of text) {
    // Swap the five special characters, keep everything else as it is.
    result += replacements[char] ?? char;
  }
  return result;
}
