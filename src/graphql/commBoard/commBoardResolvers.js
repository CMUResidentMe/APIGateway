import { commBoardController } from "../../controllers/commBoardController.js";
import { userService } from "../../utils/UserService.js";

export const commBoardResolvers = {
  // Query resolvers
  Query: {
    threads: async (_, { pageNum, pageSize }) => {
      return await commBoardController.getThreads(pageNum, pageSize);
    },
    thread: async (_, { id }) => {
      return await commBoardController.getThread(id);
    },
    postsByThread: async (_, { threadId, pageNum, pageSize }) => {
      return await commBoardController.getPostsByThread(
        threadId,
        pageNum,
        pageSize
      );
    },
    repliesByPost: async (_, { postId, pageNum, pageSize }) => {
      return await commBoardController.getRepliesByPost(
        postId,
        pageNum,
        pageSize
      );
    },
  },
  // Mutation resolvers
  // The user object is retrieved from querying the user service using the user ID from the context.
  Mutation: {
    createThread: async (_, { title, content }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      const userName = user.username;
      return await commBoardController.createThread(
        title,
        content,
        userId,
        userName
      );
    },
    deleteThread: async (_, { id }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      const privilege = user.privilege;
      return await commBoardController.deleteThread(id, userId, privilege);
    },
    createPost: async (_, { threadId, content }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      const userName = user.username;
      return await commBoardController.createPost(
        threadId,
        content,
        userId,
        userName
      );
    },
    deletePost: async (_, { id }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      const privilege = user.privilege;
      return await commBoardController.deletePost(id, userId, privilege);
    },
    createReply: async (_, { postId, content }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      const userName = user.username;
      return await commBoardController.createReply(
        postId,
        content,
        userId,
        userName
      );
    },
    deleteReply: async (_, { id }, context) => {
      const userId = context.user;
      const user = await userService.getUserById(userId);
      console.log("user: ", user);
      const privilege = user.privilege;
      return await commBoardController.deleteReply(id, userId, privilege);
    },
  },
};
