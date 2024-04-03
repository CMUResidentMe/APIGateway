import { gql } from 'apollo-server-express';

export const typeDefs = gql`

  type Query {
    _empty: String
  }

  type Mutation {
    register(username: String!, password: String!, firstName: String!, lastName: String!, roomNumber: Int!): UserResponse
    login(username: String!, password: String!): AuthResponse
  }

  type UserResponse {
    message: String
    error: String
  }

  type AuthResponse {
    token: String
    privilege: String
    error: String
  }
`;
