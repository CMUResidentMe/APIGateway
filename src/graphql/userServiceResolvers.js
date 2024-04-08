import { gql, request } from 'graphql-request';
import { ApolloError } from 'apollo-server-express';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $firstName: String!, $lastName: String!, $roomNumber: Int!) {
    register(username: $username, password: $password, firstName: $firstName, lastName: $lastName, roomNumber: $roomNumber)
  }
`;


const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      privilege
    }
  }
`;

export const userResolvers = {
    Query: {
        _empty: () => '',
      },
    Mutation: {
      register: async (_, { username, password, firstName, lastName, roomNumber }) => {
        try {
          const data = await request(process.env.USER_SERVICE_URL, REGISTER_MUTATION, {
            username,
            password,
            firstName,
            lastName,
            roomNumber,
          });
          return data.register;
        } catch (error) {
          console.error("Error in register resolver:", error);
          const errorMessage = error.response?.errors?.[0]?.message || 'An unexpected error occurred during registration.';
          throw new ApolloError(errorMessage, "REGISTRATION_FAILED");
        }        
      },
      login: async (_, { username, password }) => {
        try {
          const data = await request(process.env.USER_SERVICE_URL, LOGIN_MUTATION, {
            username,
            password,
          });
          console.log("data: " + JSON.stringify(data));
          return {token: data.login.token, privilege: data.login.privilege};
        } catch (error) {
          // console.error("Error in login resolver:", error);
          // const message = error.response?.errors?.[0]?.message || 'An unexpected error occurred during login.';
          // return { token: null, privilege: null, error: message };
          console.error("Error in login resolver:", error);
          const message = error.response?.errors?.[0]?.message || 'An unexpected error occurred during login.';
          throw new ApolloError(message, "LOGIN_FAILED");
        }
      },
    },
  };
