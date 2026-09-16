import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// The design system has to load before anything else paints.
// index.css was never imported before, which is why it sat empty and unused.
import "./styles/theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
