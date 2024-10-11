"use client";

import { authApiSliceReducer } from "./Auth/AuthSlice";
import rootReducers from "./rootReducers";
import { configureStore } from "@reduxjs/toolkit";

// const persistConfig = {
//   key: "auth",
//   storage: storage,
//   whitelist: ["auth", "email"],
// };
// const pReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};

// const store = legacy_createStore(pReducer, initialState);
const store = configureStore({
  reducer: rootReducers,
  userData: authApiSliceReducer,
});

// const persistor = persistStore(store);

export { store };
