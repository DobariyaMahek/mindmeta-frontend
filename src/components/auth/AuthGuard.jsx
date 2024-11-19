import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { SplashScreen } from "@/components/splash-screen"; // CONFIGURATION SETTINGS

export default function AuthGuard({ children }) {
  const { isInitialized, isAuthenticated } = useAuth();
  const location = useLocation();

  // Wait until the authentication status is initialized
  if (!isInitialized) {
    // Optionally, you can render a loading screen or spinner here
    return <SplashScreen />;
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/login"
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Allow access to the protected route
  return <>{children}</>;
}
