import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./app/store";
import { App } from "./App";
import "./index.css";

const GOOGLE_CLIENT_ID =
  "860722217090-fm9m8t0gr94mhp25h3lbqa7ffb0vjv5j.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
