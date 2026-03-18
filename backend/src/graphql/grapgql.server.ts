import { ApolloServer } from "@apollo/server";
import { userTypeDefs } from "./user/schemas/user.schema.js";
import { resolvers } from "./user/resolvers/user.resolver.js";

export async function server() {
  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: resolvers,
  });
  await server.start();
  return server;
}
