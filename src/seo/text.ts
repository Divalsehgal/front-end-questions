// Plain-text helpers for <title>, meta descriptions and JSON-LD, which must not contain markdown.
// Every pattern here runs in linear time on hostile input (no two quantifiers can match the same
// characters); src/seo/text.test.ts pins that with long adversarial strings.

// Line-start rules: `[^\S\n\r\u2028\u2029]*` is `\s*` minus line terminators, so the leading
// indentation can't run into the next line (with /m, `^\s*` rescans every following blank line).
const TABLE_RULE = /^[^\S\n\r\u2028\u2029]*(?:\|\s*)?:?-{2,}.*/gm;
const LIST_MARKER = /^[^\S\n\r\u2028\u2029]*(?:[-*+]|\d+\.)\s+/gm;

/** Markdown-lite (the Prose dialect) to one line of plain text. Code fences are dropped, inline code keeps its text. */
export function stripMarkdown(md: string) {
  const text = md
    .replaceAll(/```[\s\S]*?(```|$)/g, ' ')
    .replaceAll(/`([^`]*)`/g, '$1')
    .replaceAll(/\*\*([^*]+)\*\*/g, '$1')
    .replaceAll(/(^|\s)[*_]([^*_\s][^*_]*)[*_](?=\s|[.,;:!?)]|$)/g, '$1$2');
  return unlink(text)
    .replaceAll(TABLE_RULE, ' ')
    .replaceAll('|', ' ')
    .replaceAll(LIST_MARKER, '')
    .replaceAll(/^#+\s+/gm, '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

/**
 * `[text](url)` -> `text`, exactly like replacing /\[([^\]]+)\]\([^)]*\)/g with '$1', in one pass:
 * every `[` before the same `]` shares that `]`'s outcome, so a failed candidate skips past it.
 */
function unlink(s: string) {
  let out = '';
  let copied = 0;
  let open = s.indexOf('[');
  while (open !== -1) {
    const close = s.indexOf(']', open + 1);
    if (close === -1) break;
    const isLink = close > open + 1 && s[close + 1] === '(';
    const end = isLink ? s.indexOf(')', close + 2) : -1;
    // No ")" left: no later "[" can complete a link either.
    if (isLink && end === -1) break;
    if (end !== -1) {
      out += s.slice(copied, open) + s.slice(open + 1, close);
      copied = end + 1;
    }
    open = s.indexOf('[', end === -1 ? close + 1 : copied);
  }
  return out + s.slice(copied);
}

const TRAILING_PUNCTUATION = /[\s,.;:–—-]/;

/** Cuts at a word boundary so the result (with "…") is at most `max` characters. */
export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  // Cut at the last space, unless the cut already ends exactly at a word boundary.
  const space = /\s/.test(text.charAt(max - 1)) ? cut.length : cut.lastIndexOf(' ');
  const head = space > max * 0.6 ? cut.slice(0, space) : cut;
  let end = head.length;
  while (end > 0 && TRAILING_PUNCTUATION.test(head.charAt(end - 1))) end--;
  return `${head.slice(0, end)}…`;
}

/** First candidate that fits in `max`, else the last one truncated. */
export function fitFirst(candidates: string[], max: number) {
  return candidates.find((c) => c.length <= max) ?? truncate(candidates[candidates.length - 1], max);
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s: string) => s.replaceAll(/[&<>"']/g, (c) => ESCAPES[c]);
