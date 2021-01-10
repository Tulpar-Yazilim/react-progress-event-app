import React from "react";
import ReactDOM from "react-dom";
import { ToastProvider } from "react-toast-notifications";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <>
    <ToastProvider>
      <App />
    </ToastProvider>
  </>,
  document.getElementById("root")
);

serviceWorker.unregister();
