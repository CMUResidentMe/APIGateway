import { gql } from "apollo-server-express";

export const commBoardTypeDefs = gql`
  type Thread {
    id: ID!
    title: String!
    content: String!
    userId: String!
    userName: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    content: String!
    userId: String!
    userName: String!
    createdAt: String!
  }

  type Reply {
    id: ID!
    content: String!
    userId: String!
    userName: String!
    createdAt: String!
  }

  type Query {
    threads(pageNum: Int!, pageSize: Int!): [Thread]
    thread(id: ID!): Thread
    postsByThread(threadId: ID!, pageNum: Int!, pageSize: Int!): [Post]
    repliesByPost(postId: ID!, pageNum: Int!, pageSize: Int!): [Reply]
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
