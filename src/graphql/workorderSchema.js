import { gql } from 'apollo-server-express';

export const workOrdeTypeDefs = gql`
  enum WorkStatus {
    OPEN
    ASSIGNED
    ONGOING
    FINISHED
  }

  enum EntryPermission{
    CALLCONFIRM
    KNOCKDOOR
    ALL_PERMISSIONS
  }

  enum Priority{
    High
    Medium
    Low
  }
  
  type DetailedWorkOrder{
    uuid: String!
    owner: String!
    workType: String
    priority: Priority
    detail: String
    status: WorkStatus
    accessInstruction: String
    preferredTime: String
    entryPermission: EntryPermission
    images: [String!]
    assignedStaff: String
  }

  type Query {
    workOrders: [DetailedWorkOrder]
    workOrdersByOwner: [DetailedWorkOrder!]
    workOrdersUnassined: [DetailedWorkOrder]
    workOrdersByAssignedStaff: [DetailedWorkOrder!]
    workOrder(uuid: String!): DetailedWorkOrder
  }

  type Mutation {
    createWorkOrder(workType: String, priority: Priority, detail: String, accessInstruction: String, preferredTime: String, entryPermission: EntryPermission, images: [String!]): DetailedWorkOrder
    changeWorkOrder(uuid: String!, workType: String, priority: Priority, detail: String, accessInstruction: String, preferredTime: String, entryPermission: EntryPermission, images: [String!]): DetailedWorkOrder
    updateWorkOrderStatus(uuid: String!, status: WorkStatus!): DetailedWorkOrder
    assignedStaff(uuid: String!): DetailedWorkOrder
    unAssignedStaff(uuid: String!): DetailedWorkOrder
    cancelWorkOrder(uuid: String!): String
  }
`;
