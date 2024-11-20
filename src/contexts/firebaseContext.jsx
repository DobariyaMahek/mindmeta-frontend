import { createContext, useEffect, useReducer, useMemo } from "react";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"; // Firebase auth functions

import { initializeApp } from "firebase/app";
import { SplashScreen } from "@/components/splash-screen";

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APT_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initial state
const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return { ...state, ...action.payload, isInitialized: true };

    default:
      return state;
  }
};

// Firebase authentication handlers
const provider = new GoogleAuthProvider();

const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const signInWithGoogle = () => signInWithPopup(auth, provider);

const createUserWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return signInWithEmail(email, password);
    } else {
      throw error;
    }
  }
};

// Context initialization
export const AuthContext = createContext({
  ...initialAuthState,
  method: "FIREBASE",
  signInWithGoogle,
  signInWithEmail,
  createUserWithEmail,
});

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const logout = () => {
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });
    localStorage.clear(); // Clear all data in localStorage
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (user) {
      const payload = {
        isAuthenticated: true,
        user: {
          id: user?.user_info?.id,
          role: user?.role,
          email: user?.user_info?.email,
          avatar: "",
          name: user?.user_info?.email,
        },
      };

      dispatch({
        type: "AUTH_STATE_CHANGED",
        payload,
      });
    } else {
      dispatch({
        type: "AUTH_STATE_CHANGED",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (event.key === "authUser" && !event.newValue) {
  //       // If authUser is removed or localStorage is cleared, log out
  //       logout();
  //       dispatch({
  //         type: "AUTH_STATE_CHANGED",
  //         payload: {
  //           isAuthenticated: false,
  //           user: null,
  //         },
  //       });
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  const userIsLoggedIn = (user) => {
    const payload = {
      isAuthenticated: true,
      user: {
        id: user?.user_info?.uid,
        role: user?.role,
        email: user?.user_info?.email,
        avatar: "",
        name: user?.email,
      },
    };
    localStorage.setItem("authUser", JSON.stringify(user));
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload,
    });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      userIsLoggedIn,
      logout,
      signInWithEmail,
      signInWithGoogle,
      method: "FIREBASE",
      createUserWithEmail,
    }),
    [state]
  );

  // Show splash screen while initializing
  if (!state.isInitialized) return <SplashScreen />;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
