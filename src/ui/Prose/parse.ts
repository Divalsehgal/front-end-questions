// Block-level markdown-lite: ``` fences, | tables |, "- " bullet runs and paragraphs.
export type Block =
  | { type: 'code'; code: string; lang?: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string };

const isBullet = (line: string) => /^\s*[-*] /.test(line);
const cells = (line: string) =>
  line
    .trim()
    .replaceAll(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

function textBlocks(chunk: string): Block[] {
  return chunk
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .flatMap((block): Block[] => {
      const lines = block.split('\n');
      if (lines.length > 2 && lines.every((l) => l.trim().startsWith('|'))) {
        const [head, , ...rows] = lines;
        return [{ type: 'table', head: cells(head), rows: rows.map(cells) }];
      }
      // A block can mix a lead-in sentence with bullets: split it into runs.
      const out: Block[] = [];
      for (const line of lines) {
        const last = out[out.length - 1];
        if (isBullet(line)) {
          const item = line.replace(/^\s*[-*] /, '');
          if (last?.type === 'list') last.items.push(item);
          else out.push({ type: 'list', items: [item] });
        } else if (last?.type === 'paragraph') last.text += `\n${line}`;
        else out.push({ type: 'paragraph', text: line });
      }
      return out;
    });
}

export function parseBlocks(text: string): Block[] {
  // One capture group, and both the opening and closing fence match it:
  // [text, lang, code, '', text, lang, code, '', text, …]
  const parts = text.split(/```(\w*)\n?/);
  const blocks: Block[] = [];
  for (let i = 0; i < parts.length; i += 4) {
    blocks.push(...textBlocks(parts[i]));
    if (i + 2 < parts.length) blocks.push({ type: 'code', code: parts[i + 2].replace(/\n$/, ''), lang: parts[i + 1] || undefined });
  }
  return blocks;
}
