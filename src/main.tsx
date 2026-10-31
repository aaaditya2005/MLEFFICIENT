import React from "react";
import ReactDOM from "react-dom/client";
import App, { AdminPanel } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {window.location.pathname === "/admin" || window.location.hash === "#/admin" ? <AdminPanel /> : <App />}
  </React.StrictMode>,
);
