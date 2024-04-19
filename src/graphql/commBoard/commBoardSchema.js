import { gql } from "apollo-server-express";

export const commBoardTypeDefs = gql`
  type Thread {
    id: ID!
    title: String!
    content: String!
    userId: String!
    userName: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: String!
    userName: String!
    replies: [Reply]
  }

  type Reply {
    id: ID!
    content: String!
    userId: String!
    userName: String!
  }

  type Query {
    threads: [Thread]
    thread(id: ID!): Thread
  }

  type Mutation {
    createThread(title: String!, content: String!): Thread
    deleteThread(id: ID!): Boolean
    createPost(threadId: ID!, content: String!): Post
    deletePost(id: ID!): Boolean
    createReply(postId: ID!, content: String!): Reply
    deleteReply(id: ID!): Boolean
  }
`;
