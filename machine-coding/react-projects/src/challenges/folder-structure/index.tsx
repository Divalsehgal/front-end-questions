import  { useState } from "react";
import { cn } from "../../utils/cn";
import {
  Folder as FolderIcon,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Hash,
  Settings,
  Image as ImageIcon,
  FileCode,
} from "lucide-react";
import { Collapsible } from "@base-ui/react/collapsible";

export interface FileProps {
  name: string;
  isFolder: boolean;
  children?: FileProps[];
}

const INITIAL_FILES: FileProps = {
  name: "root",
  isFolder: true,
  children: [
    {
      name: "src",
      isFolder: true,
      children: [
        { name: "App.tsx", isFolder: false },
        { name: "Folder.tsx", isFolder: false },
        { name: "data.ts", isFolder: false },
        { name: "index.tsx", isFolder: false },
        { name: "globals.css", isFolder: false },
      ],
    },
    {
      name: "public",
      isFolder: true,
      children: [
        { name: "favicon.ico", isFolder: false },
        { name: "index.html", isFolder: false },
        { name: "manifest.json", isFolder: false },
      ],
    },
    {
      name: "config",
      isFolder: true,
      children: [
        { name: "tailwind.config.ts", isFolder: false },
        { name: "vite.config.ts", isFolder: false },
      ],
    },
    { name: "package.json", isFolder: false },
    { name: "tsconfig.json", isFolder: false },
    { name: "README.md", isFolder: false },
  ],
};

function getFileIcon(name: string, isFolder: boolean, open: boolean) {
  if (isFolder) {
    return open ? (
      <FolderOpen className="size-4 text-brand-500" />
    ) : (
      <FolderIcon className="size-4 text-brand-500" />
    );
  }

  const ext = name.split(".").pop();
  switch (ext) {
    case "tsx":
    case "jsx":
    case "ts":
    case "js":
      return <FileCode className="size-4 text-brand-500" />;
    case "json":
      return <Hash className="text-warning-500 size-4" />;
    case "css":
    case "scss":
      return <Settings className="size-4 text-brand-400" />;
    case "html":
      return <File className="text-error-500 size-4" />;
    case "png":
    case "jpg":
    case "ico":
      return <ImageIcon className="text-success-500 size-4" />;
    default:
      return <File className="size-4 text-text-muted/40" />;
  }
}

function FolderItem({
  item,
  depth = 0,
}: Readonly<{ item: FileProps; depth?: number }>) {
  const [open, setOpen] = useState(depth === 0); // Root open by default

  return (
    <div className="select-none">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          className={cn(
            "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors outline-none",
            "hover:bg-muted",
            "focus-visible:ring-2 focus-visible:ring-brand-500",
            item.isFolder ? "cursor-pointer" : "cursor-default",
          )}
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          {item.isFolder ? (
            <div className="flex size-4 shrink-0 items-center justify-center">
              {open ? (
                <ChevronDown className="size-3.5 text-text-muted/40 group-hover:text-text-muted" />
              ) : (
                <ChevronRight className="size-3.5 text-text-muted/40 group-hover:text-text-muted" />
              )}
            </div>
          ) : (
            <div className="size-4 shrink-0" />
          )}

          <div className="flex shrink-0 items-center justify-center">
            {getFileIcon(item.name, item.isFolder, open)}
          </div>

          <span
            className={cn(
              "min-w-0 shrink truncate text-sm font-medium",
              item.isFolder ? "text-text-main" : "text-text-muted",
            )}
          >
            {item.name}
          </span>
        </Collapsible.Trigger>

        {item.isFolder && item.children && (
          <Collapsible.Panel className="overflow-hidden transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
            <div className="mt-0.5">
              {item.children.map((child, idx) => (
                <FolderItem
                  key={`${child.name}-${idx}`}
                  item={child}
                  depth={depth + 1}
                />
              ))}
            </div>
          </Collapsible.Panel>
        )}
      </Collapsible.Root>
    </div>
  );
}

export default function FolderStructure() {
  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <FolderItem item={INITIAL_FILES} />
    </div>
  );
}
