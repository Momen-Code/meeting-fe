import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./provider";
import { SocketProvider } from "./socket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);