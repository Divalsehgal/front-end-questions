import { useState } from 'react';

interface FileProps {
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

export default function FolderStructure() {
  // your code
  return <div className="p-6">Start building here</div>;
}
