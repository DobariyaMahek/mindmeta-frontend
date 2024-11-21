import { createBrowserRouter, RouterProvider } from "react-router-dom"; // MUI

import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // AUTH CONTEXT FILE


import RTL from "@/components/rtl"; // ROUTES METHOD

import { routes } from "./routes"; // MUI THEME CREATION METHOD

import { createCustomTheme } from "./theme"; // SITE SETTINGS CUSTOM DEFINED HOOK

import useSettings from "@/hooks/useSettings"; // I18N FILE
import "./global.css";
import "./i18n";
import { Toaster, useToasterStore } from "react-hot-toast";
import toast from "react-hot-toast";

import { useEffect } from "react";
export default function App() {
  // SITE SETTINGS CUSTOM DEFINED HOOK
  const { settings } = useSettings(); // MUI THEME CREATION

  const theme = createCustomTheme(settings); // ROUTER CREATE
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

  const router = createBrowserRouter(routes());
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
          <RTL>
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
            <CssBaseline />
            <RouterProvider router={router} />
          </RTL>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
