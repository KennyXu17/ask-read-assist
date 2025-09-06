import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";  // 👈 引入 HashRouter
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>
);
