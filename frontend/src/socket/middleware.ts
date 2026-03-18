// src/socket/middleware.ts
import { type Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setOnlineUsers } from "../toolkit/message.reducer";
import { apiSlice } from "../toolkit/apiSlice";
import type { AppDispatch, RootState } from "../toolkit/store";

let socket: Socket | null = null;

export const socketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.type === "user/setUser" && action.payload) {
      const userId = action.payload.id;

      if (!socket) {
        socket = io("http://localhost:3000", {
          query: { userId },
        });

        socket.on("getOnlineUsers", (data: string[]) => {
          store.dispatch(setOnlineUsers(data));
        });
      }

      socket.on("sendMessage", (message: any) => {
        const state = store.getState() as RootState;
        const currentUserId = state.user?.user?.id;

        const cacheKey =
          message.receiverId === currentUserId
            ? message.senderId
            : message.receiverId;

        const dispatch = store.dispatch as AppDispatch;

        dispatch(
          apiSlice.util.updateQueryData("getAllMessages", cacheKey, (draft) => {
            if (draft?.data?.getAllMessages) {
              draft.data.getAllMessages.push(message);
              draft.data.getAllMessages.sort(
                (a: any, b: any) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );
            }
          }),
        );
      });
    }

    // Handle logout
    if (action.type === "user/logOut") {
      socket?.emit("logout");
      socket?.disconnect();
      socket = null;
    }

    return next(action);
  };
