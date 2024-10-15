import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";
import { useSoftUIController } from "context";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import "./App.css"; // Import your CSS file for animations
import useRoutes from "routes";
import Loader from "components/Loader";
import { useSelector } from "react-redux";
import Calling from "components/Calling";
import { getSession } from "helper/authHelper";
import { useWebSocketContext } from "api/WebSocketProvider";
import { checkToken } from "helper/authHelper";
import { jwtDecode } from "jwt-decode";
export default function App() {
  const { authLoader } = useSelector((state) => state.auth);
  const { patientLoader } = useSelector((state) => state.patient);
  const { familyLoader } = useSelector((state) => state.family);
  const { callLoader } = useSelector((state) => state.call);
  const [controller] = useSoftUIController();
  const { direction } = controller;
  const { pathname } = useLocation();
  const userInfo = getSession();
  const routes = useRoutes();
  const navigate = useNavigate();
  const { notificationMessages } = useWebSocketContext();

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);
  useEffect(() => {
    if (userInfo) {
      const intervalId = setInterval(() => {
        if (isTokenExpired(userInfo?.refresh_token)) {
          // Token is expired, clear local storage
          localStorage.clear();
          navigate("/authentication/sign-in");
        } else {
          // Token is valid, call checkToken
          checkToken();
        }
      }, 60000); // 60000 milliseconds = 1 minute

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [userInfo]);
  const isTokenExpired = (token) => {
    if (!token) return true; // If no token, consider it expired
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime; // Check if token is expired
    } catch (error) {
      return true; // If decoding fails, consider it expired
    }
  };
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes?.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              route.isProtected ? (
                <PrivateRoute>{route.component}</PrivateRoute>
              ) : (
                <PublicRoute>{route.component}</PublicRoute>
              )
            }
            key={route.key}
          />
        );
      }

      return null;
    });
  useEffect(() => {
    if (
      notificationMessages?.[notificationMessages?.length - 1]?.message == "Receive call" &&
      userInfo?.role == "patient" &&
      notificationMessages?.[notificationMessages?.length - 1]?.scheduled_id &&
      userInfo
    ) {
      localStorage.setItem(
        "scheduled_call_id",
        JSON.stringify(notificationMessages?.[notificationMessages?.length - 1]?.scheduled_id)
      );
    }
  }, [notificationMessages]);

  return (
    <ThemeProvider theme={theme}>
      {/* {(authLoader || patientLoader || callLoader || familyLoader) && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )} */}
      {(authLoader || patientLoader || callLoader || familyLoader) && <Loader />}
      <CssBaseline />
      <Routes>
        {getRoutes(routes)}
        <Route
          path="*"
          element={<Navigate to={`${userInfo ? "/dashboard" : "authentication/sign-in"}`} />}
        />
      </Routes>{" "}
      {userInfo &&
        userInfo?.role == "patient"
        &&
        notificationMessages?.[notificationMessages?.length - 1]?.message == "Receive call"
        ? (
        <Calling />
      ) : null}
    </ThemeProvider>
  );
}
