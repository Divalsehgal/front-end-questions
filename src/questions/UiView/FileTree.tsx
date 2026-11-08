import { FileCode2, FilePlus, Folder, Plus, Trash2 } from 'lucide-react';
import { useId, useState } from 'react';
import { cn, IconButton, PaneResizer } from '../../ui';
import { ENTRY, fileNameError, normalizePath, treeRows } from '../../ui/code';

const ROW = 'flex items-center gap-1.5 py-0.5 pr-1';
const indent = (depth: number) => ({ paddingLeft: 8 + depth * 12 });

/** Explorer for a multi-file React answer: folders come from paths like components/Button.tsx. */
export function FileTree({
  files,
  active,
  onOpen,
  onCreate,
  onDelete,
}: Readonly<{ files: string[]; active: string; onOpen: (path: string) => void; onCreate: (path: string) => void; onDelete: (path: string) => void }>) {
  const [draft, setDraft] = useState<string | null>(null);
  const [width, setWidth] = useState(176);
  return (
    <nav aria-label="Files" style={{ width }} className="relative flex shrink-0 flex-col border-r border-line bg-surface-muted text-xs">
      <PaneResizer edge="right" size={width} min={120} reserve={240} label="Resize files panel" onResize={setWidth} />
      <div className="flex items-center justify-between py-1 pr-1 pl-2 font-semibold tracking-wide text-text-muted uppercase">
        Files
        <IconButton label="New file" onClick={() => setDraft('')} className="border-0 bg-transparent p-1">
          <FilePlus size={14} aria-hidden />
        </IconButton>
      </div>
      {draft !== null && (
        <NewFileInput
          key={draft}
          initial={draft}
          files={files}
          onCreate={(path) => {
            onCreate(path);
            setDraft(null);
          }}
          onCancel={() => setDraft(null)}
        />
      )}
      <ul className="min-h-0 flex-1 overflow-auto pb-2 font-mono">
        {treeRows(files).map((row) =>
          row.kind === 'folder' ? (
            <li key={`d:${row.path}`} className={cn(ROW, 'group text-text-muted')} style={indent(row.depth)}>
              <Folder size={13} aria-hidden className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{row.name}</span>
              <IconButton
                label={`New file in ${row.path}`}
                onClick={() => setDraft(`${row.path}/`)}
                className="border-0 bg-transparent p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Plus size={12} aria-hidden />
              </IconButton>
            </li>
          ) : (
            <li key={row.path} className={cn(ROW, 'group', row.path === active ? 'bg-brand-soft text-text-main' : 'text-text-muted')} style={indent(row.depth)}>
              <button
                type="button"
                aria-current={row.path === active ? 'page' : undefined}
                title={row.path}
                onClick={() => onOpen(row.path)}
                className="flex min-w-0 flex-1 items-center gap-1.5 text-left hover:text-text-main"
              >
                <FileCode2 size={13} aria-hidden className="shrink-0" />
                <span className="truncate">{row.name}</span>
              </button>
              {row.path !== ENTRY && (
                <IconButton
                  label={`Delete ${row.path}`}
                  onClick={() => window.confirm(`Delete ${row.path}?`) && onDelete(row.path)}
                  className="border-0 bg-transparent p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 size={12} aria-hidden />
                </IconButton>
              )}
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

/** Path input for a new file; folders in the path are created with it. Enter creates, Escape cancels. */
function NewFileInput({
  initial,
  files,
  onCreate,
  onCancel,
}: Readonly<{ initial: string; files: string[]; onCreate: (path: string) => void; onCancel: () => void }>) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();
  return (
    <form
      className="px-2 pb-1"
      onSubmit={(e) => {
        e.preventDefault();
        const problem = fileNameError(value, files);
        if (problem) setError(problem);
        else onCreate(normalizePath(value));
      }}
    >
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus -- opened by the user's own click
        autoFocus
        aria-label="New file path"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        placeholder="components/Button.tsx"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
        onBlur={() => !value.trim() && onCancel()}
        className="w-full rounded border border-line bg-surface px-1.5 py-0.5 font-mono"
      />
      {error && (
        <p id={errorId} className="mt-1 text-error">
          {error}
        </p>
      )}
    </form>
  );
}
