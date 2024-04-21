import { userService } from "../../utils/UserService.js";
import { marketPlaceController } from "../../controllers/marketPlaceController.js";

export const marketPlaceResolvers = {
  Query: {
    isGoodsOwner: async (_, { goodsId }, context) => {
      const user = context.user;
      return await marketPlaceController.isGoodsOwner(goodsId, user);
    },
    getAllGoods: async (_, args, context) => {
      return await marketPlaceController.getAllGoods();
    },
    getGoodsByUser: async (_, args, context) => {
      const user = context.user;
      return await marketPlaceController.getGoodsByUser(user);
    },
    getGoodsById: async (_, { id }, context) => {
      return await marketPlaceController.getGoodsById(id);
    },
    getOrdersByUser: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      return await marketPlaceController.getOrdersByUser(context.user);
    },
    getSoldOrdersByUser: async (_, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      return await marketPlaceController.getSoldOrdersByUser(context.user);
    }
  },
  Mutation: {
    deleteGoods: async (_, { id }, context) => {
        if (!context.user) {
            throw new Error("Authentication required");
        }
        return await marketPlaceController.deleteGoods(id, context.user);
    },
    addGoods: async (_, { title, description, price, image, category, tradePlace, contact }, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      return await marketPlaceController.addGoods(title, description, price, image, category, tradePlace, contact, context.user);
    },
    updateGoods: async (_, { id, title, description, price, image, category, tradePlace, contact }, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      return await marketPlaceController.updateGoods(id, title, description, price, image, category, tradePlace, contact, context.user);
    },
    buyGoods: async (_, { goodsId, contact, tradePlace }, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      return await marketPlaceController.buyGoods(goodsId, context.user, contact, tradePlace);
    }
  }
};