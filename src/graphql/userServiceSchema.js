import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  enum PrivilegeType {
    manager
    staff
    resident
  }

  type Query {
    _empty: String
  }

  type Mutation {
    register(
      username: String!
      password: String!
      firstName: String!
      lastName: String!
      roomNumber: Int
      privilege: PrivilegeType
    ): String
    login(username: String!, password: String!): AuthResponse
  }

  type UserResponse {
    message: String
    error: String
  }

  type AuthResponse {
    token: String
    username: String
    privilege: PrivilegeType
  }
`;
