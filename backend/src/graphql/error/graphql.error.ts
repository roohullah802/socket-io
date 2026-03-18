import { GraphQLError } from "graphql";

export function graphqlError(
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  status: number = 500,
): never {
  throw new GraphQLError(message, {
    extensions: {
      code,
      status,
    },
  });
}
