import { CodeEditor, ENTRY, parseProject, serializeProject, type Files, type Monaco } from '@fe-grind/ui/code';
import { useEffect, useMemo, useState } from 'react';
import { FileTree } from './FileTree';

/** A React answer as a small project: a file tree beside the editor for the open file. */
export function ProjectEditor({
  code,
  onCode,
  root,
  label,
  onRun,
}: Readonly<{ code: string; onCode: (v: string) => void; root: string; label: string; onRun: () => void }>) {
  const files = useMemo(() => parseProject(code), [code]);
  const [open, setOpen] = useState(ENTRY);
  const active = Object.hasOwn(files, open) ? open : ENTRY; // e.g. after Start fresh drops the file
  const write = (next: Files) => onCode(serializeProject(next));
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  useEffect(() => {
    if (monaco) syncModels(monaco, root, files, active);
  }, [monaco, root, files, active]);
  return (
    <div className="flex h-full min-h-0">
      <FileTree
        files={Object.keys(files)}
        active={active}
        onOpen={setOpen}
        onCreate={(path) => {
          write({ ...files, [path]: '' });
          setOpen(path);
        }}
        onDelete={(path) => write(Object.fromEntries(Object.entries(files).filter(([name]) => name !== path)))}
      />
      <CodeEditor
        // One Monaco model per file under a shared root, so the editor resolves imports between them.
        path={`${root}/${active}`}
        label={active === ENTRY ? label : `${label}: ${active}`}
        value={files[active]}
        onChange={(v) => write({ ...files, [active]: v })}
        onRun={onRun}
        onMonaco={setMonaco}
        className="h-full min-w-0 flex-1"
      />
    </div>
  );
}

/**
 * Every project file gets a Monaco model, not just the open one, so the TypeScript service sees the
 * whole project: types and suggestions (auto-imports included) flow across files, and deleted files stop resolving.
 */
function syncModels(monaco: Monaco, root: string, files: Files, active: string) {
  for (const [name, text] of Object.entries(files)) {
    const uri = monaco.Uri.parse(`${root}/${name}`);
    const model = monaco.editor.getModel(uri);
    if (!model) monaco.editor.createModel(text, 'typescript', uri);
    // The open file's model is the editor's own; it is already up to date.
    else if (name !== active && model.getValue() !== text) model.setValue(text);
  }
  for (const model of monaco.editor.getModels()) {
    const uri = model.uri.toString();
    if (uri.startsWith(`${root}/`) && !Object.hasOwn(files, uri.slice(root.length + 1))) model.dispose();
  }
}
