import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { graphqlError } from "../../error/graphql.error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  public static async login(
    payload: { email: string; password: string },
    res: Response,
  ) {
    try {
      const { email, password } = payload;
      if (!email || !password) {
        return graphqlError(
          "please enter required fields",
          "MISSING_FIELDS",
          404,
        );
      }

      const user = await User.findOne({ email });
      if (!user) {
        return graphqlError("User not found!", "NOT_FOUND", 404);
      }

      const isMatch = await bcrypt.compare(password, user?.password);

      if (!isMatch) {
        return graphqlError("Invalid Credentials", "INVALID", 400);
      }
      const data = { id: user._id, email: user.email };
      const accessToken = jwt.sign(data, process.env.ACCESS_SECRET!, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET!, {
        expiresIn: "7d",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const returnUser = {
        id: user._id,
        email: user.email,
        accessToken,
      };

      return returnUser;
    } catch (error) {
      throw error;
    }
  }

  public static async register(payload: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      const { username, email, password } = payload;
      if (!username || !email || !password) {
        return graphqlError(
          "please enter required fields!",
          "MISSING_FIELDS",
          400,
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return graphqlError("User already existing", "EXISTS", 400);
      }

      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user) {
        return graphqlError("User not created!", "FAILED", 400);
      }
      const returnUser = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
      return returnUser;
    } catch (error) {
      throw error;
    }
  }

  public static async me(user: { id: string; email: string } | null) {
    try {
      return user;
    } catch (error) {
      throw error;
    }
  }

  public static async refresh({ req, res }: any) {
    interface JwtUserPayload {
      id: string;
      email: string;
    }
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return graphqlError("Unauthorized!", "UNAUTHORIZED", 400);
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET!,
      ) as JwtUserPayload;
      if (!decoded) {
        return graphqlError("Token verify failed", "FAILED-JWT", 400);
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return graphqlError("User not found!", "NOT_FOUND", 404);
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.ACCESS_SECRET!,
        { expiresIn: "15m" },
      );

      return {
        id: user._id,
        email: user.email,
        accessToken: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  public static async logout({ req, res }: { req: Request; res: Response }) {
    try {
      res.clearCookie("refreshToken");
      return "Logout successfull";
    } catch (error) {
      throw error;
    }
  }
}
