import { useState } from 'react';
import { File, FileCode, Folder as FolderIcon, FolderOpen, Image, Settings } from 'lucide-react';

export interface FileProps {
  name: string;
  isFolder: boolean;
  children?: FileProps[];
}

const INITIAL_FILES: FileProps = {
  name: 'root',
  isFolder: true,
  children: [
    {
      name: 'src',
      isFolder: true,
      children: [
        { name: 'App.tsx', isFolder: false },
        { name: 'index.tsx', isFolder: false },
        { name: 'globals.css', isFolder: false },
        { name: 'components', isFolder: true, children: [{ name: 'Button.tsx', isFolder: false }] },
      ],
    },
    {
      name: 'public',
      isFolder: true,
      children: [
        { name: 'favicon.ico', isFolder: false },
        { name: 'index.html', isFolder: false },
      ],
    },
    { name: 'package.json', isFolder: false },
    { name: 'README.md', isFolder: false },
  ],
};

function getFileIcon(name: string) {
  const ext = name.split('.').pop();
  switch (ext) {
    case 'tsx':
    case 'ts':
    case 'js':
      return <FileCode className="size-4 text-brand-500" />;
    case 'json':
      return <Settings className="size-4 text-warning-500" />;
    case 'ico':
    case 'png':
      return <Image className="size-4 text-success-500" />;
    default:
      return <File className="size-4 text-text-muted" />;
  }
}

// The component renders itself for each child folder, so it works at any depth.
function Folder({ item, depth }: { item: FileProps; depth: number }) {
  const [open, setOpen] = useState(depth === 0);
  const indent = { paddingLeft: depth * 16 };

  if (!item.isFolder) {
    return (
      <li style={indent} className="flex items-center gap-2 py-1 text-sm text-text-muted">
        {getFileIcon(item.name)} {item.name}
      </li>
    );
  }

  return (
    <li>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={indent} className="flex w-full items-center gap-2 py-1 text-left text-sm font-medium text-text-main hover:bg-muted">
        {open ? <FolderOpen className="size-4 text-brand-500" /> : <FolderIcon className="size-4 text-brand-500" />} {item.name}
      </button>
      {open && (
        <ul>
          {item.children?.map((child) => (
            <Folder key={child.name} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FolderTree() {
  return (
    <ul className="mx-auto max-w-sm rounded-lg border border-border-subtle bg-surface p-2">
      <Folder item={INITIAL_FILES} depth={0} />
    </ul>
  );
}
