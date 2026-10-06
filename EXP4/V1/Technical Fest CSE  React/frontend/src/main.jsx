import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AccountProvider } from "./context/AccountContext";
import "./stylesheets/index.css";
import "./stylesheets/style.css";
import "./stylesheets/App.css";
import "./stylesheets/api-ui.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>
);
