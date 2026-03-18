import { Message } from "../../../models/messages.model.js";
import { User } from "../../../models/user.model.js";
import { graphqlError } from "../../error/graphql.error.js";

export interface IMessage {
  receiverId: string;
  senderId: string;
  seen: boolean;
  image: string;
  content: string;
}

class MessageService {
  public static async getAllUsers(user: any) {
    try {
      if (!user) {
        return graphqlError("Unauthorized!", "UNAUTHORIZED", 400);
      }
      const users = await User.find({ _id: { $ne: user.id } }).select(
        "-password -accessToken",
      );
      return users;
    } catch (error) {
      throw error;
    }
  }
  public static async sendMessage(payload: IMessage, req: any) {
    const io = req.app.get("io");

    try {
      const { receiverId, senderId, content } = payload;

      if (!receiverId || !senderId || !content) {
        return graphqlError(
          "Please enter required fields! ",
          "MISSING_FIELDS",
          400,
        );
      }

      const message = await Message.create({
        receiverId,
        senderId,
        content,
      });

      if (!message) {
        return graphqlError("Message failed! ", "FAILED", 400);
      }

      io.emit("sendMessage", message);

      return message;
    } catch (error) {
      throw error;
    }
  }

  public static async getAllMessages(payload: IMessage, user: any) {
    try {
      if (!user || !user.id) {
        return graphqlError("Unauthorizedd!", "UNAUTHORIZED", 400);
      }
      const userId = user.id;
      console.log("ff ", userId);

      if (!userId) return graphqlError("Unauthorized!", "UNAUTHORIZED", 400);
      const { receiverId } = payload;
      if (!receiverId)
        return graphqlError("Please provide Receiver ID! ", "MISING_ID", 400);

      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { receiverId: userId, senderId: receiverId },
        ],
      }).sort({ createdAt: 1 });
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
