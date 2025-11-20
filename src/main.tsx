import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

// Preload critical images (logos) early
import logoAppDark from "@assets/logos/logo-app-dark.svg";
import logoAppWhite from "@assets/logos/logo-app-white.svg";
import logoCloudDark from "@assets/logos/logo-cloud-dark.svg";
import logoCloudWhite from "@assets/logos/logo-cloud-white.svg";
import logoSoftwareDark from "@assets/logos/logo-software-dark.svg";
import logoSoftwareWhite from "@assets/logos/logo-software-white.svg";
import { preloadCriticalImages } from "./shared/utils/imagePreloader";

// Preload all logo variants immediately
preloadCriticalImages([
  logoCloudWhite,
  logoCloudDark,
  logoAppWhite,
  logoAppDark,
  logoSoftwareWhite,
  logoSoftwareDark,
]);

const rootElement = document.getElementById("root") as HTMLElement | null;

if (!rootElement) {
  throw new Error("Root element with id `root` was not found in the document.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

