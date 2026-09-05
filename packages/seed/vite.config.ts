import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

// CRA env compat: the seed still reads process.env.{PUBLIC_URL,REACT_APP_API,REACT_APP_API_HEADERS}.
const envify = (key: string) => JSON.stringify(process.env[key] || "");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "127.0.0.1",
  },
  define: {
    "process.env.PUBLIC_URL": envify("PUBLIC_URL"),
    "process.env.REACT_APP_API": envify("REACT_APP_API"),
    "process.env.REACT_APP_API_HEADERS": envify("REACT_APP_API_HEADERS"),
  },
  resolve: {
    alias: {
      react: fileURLToPath(new URL("../../node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(
        new URL("../../node_modules/react-dom", import.meta.url)
      ),
      scheduler: fileURLToPath(
        new URL("../../node_modules/scheduler", import.meta.url)
      ),
    },
  },
});