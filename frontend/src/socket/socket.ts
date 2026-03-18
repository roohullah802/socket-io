// src/socket/socket.ts
import { io } from "socket.io-client";

export let socket: any;
export const connectToSocket = (userId: string) => {
  socket = io("http://localhost:3000", {
    query: {
      userId,
    },
  });
  return socket;
};
