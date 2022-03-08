import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import globalReducer from "./slices/global.slice";

const localStorageState = localStorage.getItem("reduxState");

const preloadedState = localStorageState ? JSON.parse(localStorageState) : {};

const store = configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
