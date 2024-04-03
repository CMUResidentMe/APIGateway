import { gql, request } from 'graphql-request';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $firstName: String!, $lastName: String!, $roomNumber: Int!) {
    register(username: $username, password: $password, firstName: $firstName, lastName: $lastName, roomNumber: $roomNumber) {
      message
    }
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

export const resolvers = {
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
          return { message: data.register.message, error: null };
        } catch (error) {
          const message = error.response?.errors?.[0]?.message || 'An unexpected error occurred';
          return { message: null, error: message };
        }
      },
      login: async (_, { username, password }) => {
        try {
          const data = await request(userServiceURL, LOGIN_MUTATION, {
            username,
            password,
          });
          return { token: data.login.token, privilege: data.login.privilege, error: null };
        } catch (error) {
          const message = error.response?.errors?.[0]?.message || 'An unexpected error occurred';
          return { token: null, privilege: null, error: message };
        }
      },
    },
  };
