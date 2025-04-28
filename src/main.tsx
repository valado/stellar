import { createRoot } from "react-dom/client";

// Components
import { StrictMode } from "react";
import { App } from "./App";

// CSS
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
