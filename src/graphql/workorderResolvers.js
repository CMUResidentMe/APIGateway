
import { workOrderController } from "../controllers/workorder/workOrderController.js";

export const workOrderResolvers = {
  Query: {
    workOrders: async (parent, args, contextValue, info) => {
      return await workOrderController.getWorkOrders();
    },
    workOrdersByOwner: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.workOrdersByOwner(args, user);
    },
    workOrdersUnassined: async (parent, args, contextValue, info) => {
      return await workOrderController.workOrdersUnassined();
    },
    workOrdersByAssignedStaff: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.workOrdersByAssignedStaff(args, user);
    },
    workOrder: async (parent, args, contextValue, info) => {
      return await workOrderController.getWorkOrder(args);
    },
  },
  
  Mutation: {
    createWorkOrder: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.createWorkOrder(args, user);
    },
    changeWorkOrder: async (parent, args, contextValue, info) => {
      return await workOrderController.changeWorkOrder(args);
    },
    updateWorkOrderStatus: async (parent, args, contextValue, info) => {
      return await workOrderController.updateWorkOrderStatus(args);
    },
    assignedStaff: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.assignedStaff(args, user);
    },
    unAssignedStaff: async (parent, args, contextValue, info) => {
      return await workOrderController.unAssignedStaff(args);
    },
    cancelWorkOrder: async (parent, args, contextValue, info) => {
      const user = contextValue.user;
      return await workOrderController.cancelWorkOrder(args);
    },
  },
};
  