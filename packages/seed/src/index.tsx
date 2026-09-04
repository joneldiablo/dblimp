import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import appCtrl, { appReady } from "./app-ctrl";
import { BrowserRouterSchema } from "@dblimp/core";

function SeedLoader() {
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;
    appReady.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <main className="seed-shell">
        <div className="seed-card">
          <p className="seed-kicker">dbl-seed</p>
          <h1>Cargando contract de la aplicación…</h1>
        </div>
      </main>
    );
  }

  return <BrowserRouterSchema routes={appCtrl.rootSchema!} />;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <SeedLoader />
  </React.StrictMode>
);