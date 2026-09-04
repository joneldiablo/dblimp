import React from "react";

interface Screen {
  label: string;
  path: string;
}

interface ScreenSelectorProps {
  screens?: Screen[];
  initialPath?: string;
}

const PUBLIC_URL = process.env.PUBLIC_URL || "";

export default function ScreenSelector({
  screens = [],
  initialPath,
}: ScreenSelectorProps) {
  const [selected, setSelected] = React.useState(
    initialPath || screens?.[0]?.path || "/"
  );
  const active = screens.find((s) => s.path === selected) || {
    label: "Home",
    path: selected,
  };
  const src = `${PUBLIC_URL}${selected}`;

  return (
    <div className="screen-selector">
      <div className="screen-selector-toolbar">
        <div className="screen-selector-nav">
          {screens.map((screen) => (
            <button
              key={screen.path}
              type="button"
              className={
                screen.path === selected
                  ? "btn btn-sm btn-primary screen-selector-btn is-active"
                  : "btn btn-sm btn-outline-primary screen-selector-btn"
              }
              onClick={() => setSelected(screen.path)}
            >
              {screen.label}
            </button>
          ))}
        </div>
        <span className="screen-selector-label">{active.label}</span>
      </div>
      <div className="screen-selector-frame">
        <div className="screen-selector-chrome">
          <span className="screen-selector-dot" />
          <span className="screen-selector-dot" />
          <span className="screen-selector-dot" />
          <span className="screen-selector-url">{src}</span>
        </div>
        <iframe
          className="screen-selector-iframe"
          title={active.label}
          src={src}
        />
      </div>
    </div>
  );
}