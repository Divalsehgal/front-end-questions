import { CodeBlock } from '../CodeBlock';
import { cn, withStableKeys } from '../lib';
import { inline } from './inline';
import { parseBlocks, type Block } from './parse';

function Table({ head, rows }: Readonly<{ head: string[]; rows: string[][] }>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface-muted text-left">
          <tr>
            {withStableKeys(head).map(({ item, key }) => (
              <th key={key} scope="col" className="px-3 py-2 font-semibold">
                {inline(item)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {withStableKeys(rows, (r) => r.join('|')).map(({ item: row, key }) => (
            <tr key={key} className="border-t border-line">
              {withStableKeys(row).map((cell) => (
                <td key={cell.key} className="px-3 py-2 align-top">
                  {inline(cell.item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockView({ block }: Readonly<{ block: Block }>) {
  switch (block.type) {
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} />;
    case 'table':
      return <Table head={block.head} rows={block.rows} />;
    case 'list':
      return (
        <ul className="list-disc space-y-1 pl-5 marker:text-text-muted">
          {withStableKeys(block.items).map(({ item, key }) => (
            <li key={key}>{inline(item)}</li>
          ))}
        </ul>
      );
    case 'paragraph':
      return <p>{inline(block.text)}</p>;
  }
}

const blockKey = (block: Block) => JSON.stringify(block);

/** Markdown-lite for prompts, answers and explanations: paragraphs, "- " bullets, tables, `code`, **bold**, ``` fences. */
export function Prose({ text, className }: Readonly<{ text: string; className?: string }>) {
  return (
    <div className={cn('space-y-3 text-[15px] leading-7 text-text-main', className)}>
      {withStableKeys(parseBlocks(text), blockKey).map(({ item, key }) => (
        <BlockView key={key} block={item} />
      ))}
    </div>
  );
}
