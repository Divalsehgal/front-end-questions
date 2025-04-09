
import React, { useEffect } from "react";
import Checkbox from "./components/Checkbox";
import { list, ListProps } from "./list";

export default function AllCheckboxes() {
  const [boxState, setBoxState] = React.useState<ListProps[]>(list);
  const [select, setSelect] = React.useState<boolean>(false);

  const onChangeHandler = (id: number | string) => {
    if (id === "select all") {
      setBoxState((prev) => {
        return prev.map((f) => {
          return {
            ...f,
            checked: !select,
          };
        });
      });
      setSelect(!select);
    } else {
      setBoxState((prev) => {
        return prev.map((f) => {
          if (f.id == id) {
            return {
              ...f,
              checked: !f.checked,
            };
          } else {
            return f;
          }
        });
      });
    }
  };

  useEffect(() => {
    if (boxState.every((b) => b.checked)) {
      setSelect(true);
    } else {
      setSelect(false);
    }
  }, [boxState]);

  return (
    <div className="h-screen items-center justify-center flex flex-col text-tertiary-light dark:text-tertiary-dark">
      <Checkbox
        id="select all"
        label={"select all"}
        onChange={onChangeHandler}
        checked={select}
      />
      {boxState?.map((b) => (
          <Checkbox
            key={b.id}
            label={b.name}
            id={b.id}
            onChange={onChangeHandler}
            checked={b.checked}
          />
      ))}
    </div>
  );
}
