import React, { useState } from "react";
import Icon from "./Icon";
import { FileProps } from "../files";

const Folder = (props: FileProps) => {
  const { name, isFolder, children } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        {isFolder && (
          <Icon
            style={{
              height: "10px",
              width: "10px",
            }}
            name={open ? "caretDown" : "caretRight"}
            onClick={() => setOpen(!open)}
          />
        )}
        {name}
      </div>

      <div>
        {isFolder &&
          open &&
          children?.map((f: FileProps) => {
            return <Folder key={f.name} {...f} />;
          })}
      </div>
    </>
  );
};
export default Folder;
