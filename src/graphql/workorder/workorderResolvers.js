import { workOrderController } from "../../controllers/workorder/workOrderController.js";

export const workOrderResolvers = {
  Query: {
    workOrders: async (parent, args, context, info) => {
      return await workOrderController.findAllWorkOrders();
    },
    workOrdersByOwner: async (parent, args, context, info) => {
      const user = context.user;
      return await workOrderController.findWorkOrdersByOwner(args, user);
    },
    workOrdersUnassigned: async (parent, args, context, info) => {
      return await workOrderController.findAllUnAssignedWorkOrders();
    },
    workOrdersByAssignedStaff: async (parent, args, context, info) => {
      const user = context.user;
      return await workOrderController.findWorkOrdersByAssignedStaff(args, user);
    },
    workOrder: async (parent, args, context, info) => {
      return await workOrderController.findOneWorkOrder(args);
    },
  },
  
  Mutation: {
    createWorkOrder: async (parent, args, context, info) => {
      const user = context.user;
      return await workOrderController.createWorkOrder(args, user);
    },
    changeWorkOrder: async (parent, args, context, info) => {
      return await workOrderController.changeWorkOrder(args);
    },
    updateWorkOrderStatus: async (parent, args, context, info) => {
      return await workOrderController.updateWorkOrderStatus(args);
    },
    assignWorkOrderStaff: async (parent, args, context, info) => {
      const user = context.user;
      return await workOrderController.assignWorkOrderStaff(args, args);
    },
    unassignWorkOrderStaff: async (parent, args, context, info) => {
      return await workOrderController.unassignWorkOrderStaff(args);
    },
    cancelWorkOrder: async (parent, args, context, info) => {
      const user = context.user;
      return await workOrderController.cancelWorkOrder(args);
    },
  },
};