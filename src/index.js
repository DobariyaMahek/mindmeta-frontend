import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { SoftUIControllerProvider } from "context";
import { Provider } from "react-redux";
import store from "./redux/index";
import { WebSocketProvider } from "api/WebSocketProvider";
import './index.css'
const TOAST_LIMIT = 1;

function ToastLimitEffect() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      ?.filter((t) => t.visible)
      ?.filter((_, i) => i >= TOAST_LIMIT)
      ?.forEach((t) => toast?.dismiss(t.id));
  }, [toasts]);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <SoftUIControllerProvider>
        <WebSocketProvider>
          <ToastLimitEffect />
          <Toaster
            containerStyle={{ zIndex: "99999999999999" }}
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                fontSize: "13px", // Set the font size
                color: "#232743", // Set the text color
                backgroundColor: "#fff", // Set the background color
              },
            }}
          />
          <App />
        </WebSocketProvider>
      </SoftUIControllerProvider>
    </BrowserRouter>
  </Provider>
);
