import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root") as HTMLElement | null;

if (!rootElement) {
  throw new Error("Root element with id `root` was not found in the document.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

