import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store, persistor } from "./redux/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A2030",
                color: "#F1F5F9",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#34E5A8", secondary: "#0D1119" } },
              error: { iconTheme: { primary: "#FB7185", secondary: "#0D1119" } },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
