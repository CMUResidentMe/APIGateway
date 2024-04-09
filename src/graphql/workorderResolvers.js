
import { workOrderController } from "../controllers/workOrderController.js";

export const workOrderResolvers = {
  Query: {
    workOrders: async (parent, args, contextValue, info) => {
      return await workOrderController.getWorkOrders();
    },
    workOrder: async (parent, args, contextValue, info) => {
      return await workOrderController.getWorkOrder(args);
    },
  },
  
  Mutation: {
    buildWorkOrder: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.buildWorkOrder(args, user);
    },
    changeWorkOrder: async (parent, args, contextValue, info) => {
      return await workOrderController.changeWorkOrder(args);
    },
    setPreferredtime: async (parent, args, contextValue, info) => {
      return await workOrderController.setPreferredtime(args);
    },
    setAccessInstruction: async (parent, args, contextValue, info) => {
      return await workOrderController.setAccessInstruction(args);
    },
    setStatus: async (parent, args, contextValue, info) => {
      return await workOrderController.setStatus(args);
    },
    setPriority: async (parent, args, contextValue, info) => {
      return await workOrderController.setPriority(args);
    },
    setAssignedstaff: async (parent, args, contextValue, info) => {
      return await workOrderController.setAssignedstaff(args);
    },
  },
};
  