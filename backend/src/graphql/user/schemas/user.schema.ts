export const userTypeDefs = `#graphql

type User {
    id: ID,
    username: String,
    email: String,
    accessToken: String,
    createdAt: String,
    updatedAt: String
}
type Message {
    id: ID,
    receiverId: String,
    senderId: String,
    content: String,
    seen: Boolean,
    image: String
}

type Me {
    id: ID,
    email: String
}

type Query {
    me: Me,
    getAllUsers: [User],
    getAllMessages(receiverId: String!): [Message]
}

type Mutation {
    userLogin(email: String!, password: String!): User!,
    userRegister(username: String!, email: String!, password: String!): User!,
    refresh: User!,
    logout: String!,
    sendMessage(receiverId: String!, senderId: String!, content: String!): Message!,
}
`;
