import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const onlineUsersMap = new Set();
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("a user connected", userId);
    if (userId) {
      onlineUsersMap.add(userId);
      io.emit("getOnlineUsers", Array.from(onlineUsersMap));
    }

    socket.on("logout", () => {
      if (userId) {
        onlineUsersMap.delete(userId);
        io.emit("getOnlineUsers", Array.from(onlineUsersMap));
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", userId);
      if (onlineUsersMap.has(userId)) {
        onlineUsersMap.delete(userId);
        io.emit("getOnlineUsers", Array.from(onlineUsersMap));
      }
    });
  });

  return io;
};
