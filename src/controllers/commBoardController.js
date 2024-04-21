import { GraphQLClient, gql } from "graphql-request";

class CommBoardController {
  constructor() {
    this.graphqlClient = new GraphQLClient(
      process.env.COMMUNICATION_SERVICE_URL
    );
    console.log(
      "CommBoard Service Client Initialized with URL:",
      process.env.COMMUNICATION_SERVICE_URL
    );
  }

  async getThreads(pageNum, pageSize) {
    const query = gql`
      query GetThreads($pageNum: Int!, $pageSize: Int!) {
        threads(pageNum: $pageNum, pageSize: $pageSize) {
          id
          title
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { pageNum, pageSize };
    const data = await this.graphqlClient.request(query, variables);
    return data.threads;
  }

  async getThread(id) {
    const query = gql`
      query getThread($id: ID!) {
        thread(id: $id) {
          id
          title
          content
          userId
          userName
        }
      }
    `;
    const variables = { id };
    const data = await this.graphqlClient.request(query, variables);
    return data.thread;
  }

  async getPostsByThread(threadId, pageNum, pageSize) {
    const query = gql`
      query GetPostsByThread($threadId: ID!, $pageNum: Int!, $pageSize: Int!) {
        postsByThread(
          threadId: $threadId
          pageNum: $pageNum
          pageSize: $pageSize
        ) {
          id
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { threadId, pageNum, pageSize };
    const data = await this.graphqlClient.request(query, variables);
    return data.postsByThread;
  }

  async getRepliesByPost(postId, pageNum, pageSize) {
    const query = gql`
      query GetRepliesByPost($postId: ID!, $pageNum: Int!, $pageSize: Int!) {
        repliesByPost(postId: $postId, pageNum: $pageNum, pageSize: $pageSize) {
          id
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { postId, pageNum, pageSize };
    const data = await this.graphqlClient.request(query, variables);
    return data.repliesByPost;
  }

  async createThread(title, content, userId, userName) {
    const mutation = gql`
      mutation createThread(
        $title: String!
        $content: String!
        $userId: String!
        $userName: String!
      ) {
        createThread(
          title: $title
          content: $content
          userId: $userId
          userName: $userName
        ) {
          id
          title
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { title, content, userId, userName };
    console.log("variables: ", variables);
    const data = await this.graphqlClient.request(mutation, variables);
    return data.createThread;
  }

  async deleteThread(id, userId, privilege) {
    const mutation = gql`
      mutation deleteThread($id: ID!, $userId: String!, $privilege: String!) {
        deleteThread(id: $id, userId: $userId, privilege: $privilege)
      }
    `;
    const variables = { id, userId, privilege };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.deleteThread;
  }

  async createPost(threadId, content, userId, userName) {
    const mutation = gql`
      mutation createPost(
        $threadId: ID!
        $content: String!
        $userId: String!
        $userName: String!
      ) {
        createPost(
          threadId: $threadId
          content: $content
          userId: $userId
          userName: $userName
        ) {
          id
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { threadId, content, userId, userName };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.createPost;
  }

  async deletePost(id, userId, privilege) {
    const mutation = gql`
      mutation deletePost($id: ID!, $userId: String!, $privilege: String!) {
        deletePost(id: $id, userId: $userId, privilege: $privilege)
      }
    `;
    const variables = { id, userId, privilege };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.deletePost;
  }

  async createReply(postId, content, userId, userName) {
    const mutation = gql`
      mutation createReply(
        $postId: ID!
        $content: String!
        $userId: String!
        $userName: String!
      ) {
        createReply(
          postId: $postId
          content: $content
          userId: $userId
          userName: $userName
        ) {
          id
          content
          userId
          userName
          createdAt
        }
      }
    `;
    const variables = { postId, content, userId, userName };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.createReply;
  }

  async deleteReply(id, userId, privilege) {
    const mutation = gql`
      mutation deleteReply($id: ID!, $userId: String!, $privilege: String!) {
        deleteReply(id: $id, userId: $userId, privilege: $privilege)
      }
    `;
    const variables = { id, userId, privilege };
    const data = await this.graphqlClient.request(mutation, variables);
    return data.deleteReply;
  }
}

export const commBoardController = new CommBoardController();
