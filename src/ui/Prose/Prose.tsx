import { CodeBlock } from '../CodeBlock';
import { cn } from '../lib';
import { inline } from './inline';
import { parseBlocks, type Block } from './parse';

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface-muted text-left">
          <tr>
            {head.map((c, k) => (
              <th key={k} scope="col" className="px-3 py-2 font-semibold">
                {inline(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className="border-t border-line">
              {r.map((c, m) => (
                <td key={m} className="px-3 py-2 align-top">
                  {inline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} />;
    case 'table':
      return <Table head={block.head} rows={block.rows} />;
    case 'list':
      return (
        <ul className="list-disc space-y-1 pl-5 marker:text-text-muted">
          {block.items.map((item, k) => (
            <li key={k}>{inline(item)}</li>
          ))}
        </ul>
      );
    case 'paragraph':
      return <p>{inline(block.text)}</p>;
  }
}

/** Markdown-lite for prompts, answers and explanations: paragraphs, "- " bullets, tables, `code`, **bold**, ``` fences. */
export function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn('space-y-3 text-[15px] leading-7 text-text-main', className)}>
      {parseBlocks(text).map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
