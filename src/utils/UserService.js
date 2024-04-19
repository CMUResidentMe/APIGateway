import { GraphQLClient, gql } from "graphql-request";

class UserService {
  constructor() {
    this.graphqlClient = new GraphQLClient(process.env.USER_SERVICE_URL);
    console.log(
      "User Service Util Client Initialized with URL:",
      process.env.USER_SERVICE_URL
    );
  }

  async getUsernameById(userId) {
    const query = gql`
      query getUserById($id: ID!) {
        getUserById(id: $id) {
          username
        }
      }
    `;
    const variables = { id: userId };
    try {
      const data = await this.graphqlClient.request(query, variables);
      if (data.getUserById) {
        return data.getUserById.username;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
}

export const userService = new UserService();
