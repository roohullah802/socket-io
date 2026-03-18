import express, { Application } from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { expressMiddleware } from "@as-integrations/express4";
import { server } from "./graphql/grapgql.server.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./socket/socket.js";
dotenv.config();
await connectDB();

const app: Application = express();
const port = process.env.PORT || 3000;

const http = createServer(app);

const io = initSocket(http);
app.set("io", io);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  "/graphql",
  expressMiddleware(await server(), {
    context: async ({ req, res }) => {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return { user: null, res, req };
      }
      const token = authHeader.split(" ")[1];

      try {
        const decode = jwt.verify(token, process.env.ACCESS_SECRET!);
        if (!decode) {
          return { user: null, res, req };
        }

        return { user: decode, res, req };
      } catch (error) {
        return { user: null, res, req };
      }
    },
  }),
);

http.listen(port, () => {
  console.log(`server started at: ${port}`);
});
