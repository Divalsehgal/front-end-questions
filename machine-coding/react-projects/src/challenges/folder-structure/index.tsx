import React, { useState } from "react";
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
  Files
} from "lucide-react";
import { Collapsible } from "@base-ui/react/collapsible";

export interface FileProps {
  name: string;
  isFolder: boolean;
  children?: FileProps[];
}

export const hint = "Recursive file explorer with expand/collapse folders";

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
    return open ? 
      <FolderOpen className="w-4 h-4 text-brand-500" /> : 
      <FolderIcon className="w-4 h-4 text-brand-500" />;
  }
  
  const ext = name.split(".").pop();
  switch (ext) {
    case "tsx":
    case "jsx":
    case "ts":
    case "js":
      return <FileCode className="w-4 h-4 text-brand-500" />;
    case "json":
      return <Hash className="w-4 h-4 text-warning-500" />;
    case "css":
    case "scss":
      return <Settings className="w-4 h-4 text-brand-400" />;
    case "html":
      return <File className="w-4 h-4 text-error-500" />;
    case "png":
    case "jpg":
    case "ico":
      return <ImageIcon className="w-4 h-4 text-success-500" />;
    default:
      return <File className="w-4 h-4 text-text-muted/40" />;
  }
}

function FolderItem({ item, depth = 0 }: { item: FileProps; depth?: number }) {
  const [open, setOpen] = useState(depth === 0); // Root open by default

  return (
    <div className="select-none">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger 
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group text-left outline-none",
            "hover:bg-muted",
            "focus-visible:ring-2 focus-visible:ring-brand-500",
            item.isFolder ? "cursor-pointer" : "cursor-default"
          )}
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          {item.isFolder ? (
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              {open ? (
                <ChevronDown className="w-3.5 h-3.5 text-text-muted/40 group-hover:text-text-muted" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-text-muted/40 group-hover:text-text-muted" />
              )}
            </div>
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}
          
          <div className="shrink-0 flex items-center justify-center">
            {getFileIcon(item.name, item.isFolder, open)}
          </div>
          
          <span className={cn(
            "text-sm font-medium truncate shrink min-w-0",
            item.isFolder ? "text-text-main" : "text-text-muted"
          )}>
            {item.name}
          </span>
        </Collapsible.Trigger>

        {item.isFolder && item.children && (
          <Collapsible.Panel className="overflow-hidden transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
            <div className="mt-0.5">
              {item.children.map((child, idx) => (
                <FolderItem key={`${child.name}-${idx}`} item={child} depth={depth + 1} />
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
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
          <Files className="w-6 h-6 text-brand-500" />
          Workspace
        </h2>
        <p className="text-sm font-medium text-text-muted">
          A high-performance file explorer with recursive nesting and state management.
        </p>
      </div>

      <div className="bg-surface border border-subtle rounded-2xl shadow-soft overflow-hidden p-2">
        <div className="p-4 space-y-1">
          <FolderItem item={INITIAL_FILES} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-brand-500/5 rounded-xl border border-brand-500/10">
          <p className="text-tiny font-black text-brand-500 uppercase tracking-wider mb-1">Architecture</p>
          <p className="text-tiny text-text-main/70 font-medium">Recursive component pattern with recursive state tree logic.</p>
        </div>
        <div className="p-4 bg-muted rounded-xl border border-subtle">
          <p className="text-tiny font-black text-text-muted uppercase tracking-wider mb-1">Accessibility</p>
          <p className="text-tiny text-text-muted font-medium">Keyboard navigable through Base UI Collapsible primitives.</p>
        </div>
      </div>
    </div>
  );
}
