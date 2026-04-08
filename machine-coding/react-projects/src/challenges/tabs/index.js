import { useState, useRef } from "react";

export default function Tabs({ defaultValue, items }) {
  const [value, setValue] = useState(defaultValue ?? items[0].value);
  const tabsRef = useRef([])


  const focusTab = (index) => {
    tabsRef.current[index]?.focus();
  };

  const handleKeyDown = (e, index) => {
    let newIndex = index;

    switch (e.key) {
      case "ArrowRight":
        // Move next, wrap to 0 if at end (e.g., (2 + 1) % 3 = 0)
        newIndex = (index + 1) % items.length;
        focusTab(newIndex);
        break;

      case "ArrowLeft":
        // Move prev, wrap to end if at 0 (e.g., (0 - 1 + 3) % 3 = 2)
        newIndex = (index - 1 + items.length) % items.length;
        focusTab(newIndex);
        break;

      case "Home":
        focusTab(0);
        break;

      case "End":
        focusTab(items.length - 1);
        break;

      case "Enter":
      case " ":
        setValue(items[index].value);
        break;

      default:
        return;
    }

    e.preventDefault();
  };

  return (
    <div className="tabs">
      {/* TAB LIST */}
      <p>
        TAB                         PANEL
        ----------------------------------------
        id="tab-1"        ←──────→  aria-labelledby="tab-1"
        aria-controls="panel-1" →   id="panel-1"
      </p>
      <div className="tabs-list" role="tablist">
        {items.map(({ label, value: itemValue }, index) => {
          const isActive = itemValue === value;

          return (
            <button
              key={itemValue}
              ref={(el) => (tabsRef.current[index] = el)}
              role="tab"
              id={`tab-${itemValue}`}
              aria-selected={isActive}
              aria-controls={`panel-${itemValue}`}
              tabIndex={isActive ? 0 : -1} // 🔥 focus control
              type="button"
              onClick={() => setValue(itemValue)}
              onKeyDown={(e) => handleKeyDown(e, index)} // 🔥 keyboard
              className={[
                "tabs-list-item",
                isActive && "tabs-list-item--active",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* PANELS */}
      <div>
        {items.map(({ panel, value: itemValue }) => {
          const isActive = itemValue === value;

          return (
            <div
              key={itemValue}
              role="tabpanel"
              id={`panel-${itemValue}`}
              aria-labelledby={`tab-${itemValue}`}
              hidden={!isActive}
            >
              {panel}
            </div>
          );
        })}
      </div>
    </div>
  );
}