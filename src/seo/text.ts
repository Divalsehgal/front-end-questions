// Plain-text helpers for <title>, meta descriptions and JSON-LD, which must not contain markdown.

/** Markdown-lite (the Prose dialect) to one line of plain text. Code fences are dropped, inline code keeps its text. */
export function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?(```|$)/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)[*_]([^*_\s][^*_]*)[*_](?=\s|[.,;:!?)]|$)/g, '$1$2')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*\|?\s*:?-{2,}.*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cuts at a word boundary so the result (with "…") is at most `max` characters. */
export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  // Cut at the last space, unless the cut already ends exactly at a word boundary.
  const space = /\s/.test(text.charAt(max - 1)) ? cut.length : cut.lastIndexOf(' ');
  const head = space > max * 0.6 ? cut.slice(0, space) : cut;
  return `${head.replace(/[\s,.;:–—-]+$/, '')}…`;
}

/** First candidate that fits in `max`, else the last one truncated. */
export function fitFirst(candidates: string[], max: number) {
  return candidates.find((c) => c.length <= max) ?? truncate(candidates[candidates.length - 1], max);
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);
