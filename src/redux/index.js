import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./ApiSlice/authSlice";
import patientSlice from "./ApiSlice/patientSlice";
import callSlice from "./ApiSlice/callSlice";
import familySlice from "./ApiSlice/familySlice";

const reducers = combineReducers({
  auth: authSlice,
  patient: patientSlice,
  call: callSlice,
  family: familySlice,
});

const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["auth", "patient", "call", "family"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: false,
});

export const persistor = persistStore(store);
export default store;
