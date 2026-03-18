// src/app/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { userSlice } from "./user.reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import { socketMiddleware } from "../socket/middleware";
import { messageSlice } from "./message.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "chat"],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice.reducer,
  chat: messageSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)
      .concat(socketMiddleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
