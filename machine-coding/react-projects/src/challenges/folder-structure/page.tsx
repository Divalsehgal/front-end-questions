import React from 'react'
import { files } from "./files";
import Folder from "./components/Folder";

export default function FolderStructure() {
  return (
    <div className="text-tertiary-light dark:text-tertiary-dark">
      <div className="container">
        <h1>Folder Structure</h1>
      </div>
      <Folder {...files} />
    </div>
  );
}
