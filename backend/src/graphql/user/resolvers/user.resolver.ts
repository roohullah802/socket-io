import { User } from "../../../models/user.model.js";
import { UserService } from "../service/auth.service.js";
import MessageService, { IMessage } from "../service/message.service.js";

export const resolvers = {
  Query: {
    me: async (_: any, args: any, { user }: any) => await UserService.me(user),
    getAllUsers: async (_: any, args: any, { user }: any) =>
      await MessageService.getAllUsers(user),
    getAllMessages: async (_: any, args: any, { user }: any) =>
      await MessageService.getAllMessages(args, user),
  },
  Mutation: {
    userRegister: async (_: any, args: any) => await UserService.register(args),
    userLogin: async (_: any, args: any, { res }: any) =>
      await UserService.login(args, res),
    refresh: async (_: any, args: any, { req, res }: any) =>
      await UserService.refresh({ req, res }),
    logout: async (_: any, args: any, { req, res }: any) =>
      await UserService.logout({ req, res }),
    sendMessage: async (_: any, args: IMessage, { req }: any) =>
      await MessageService.sendMessage(args, req),
  },
};
