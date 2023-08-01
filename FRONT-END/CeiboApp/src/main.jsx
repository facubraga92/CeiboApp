import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./state/store.js";
import { setUser } from "./state/user.js";
import { NextUIProvider } from "@nextui-org/react";
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  store.dispatch(setUser(user));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NextUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </BrowserRouter>
);
