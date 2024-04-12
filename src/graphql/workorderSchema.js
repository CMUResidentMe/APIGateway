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

  type DetailedWorkOrder{
    uuid: String!
    owner: String!
    workType: String
    priority: Int
    detail: String
    status: WorkStatus
    assignedStaff: String
    accessInstruction: String
    preferredTime: String
    entryPermission: EntryPermission
    images: [String!]
  }

  type Query {
    workOrders: [DetailedWorkOrder]
    workOrdersByOwner: [DetailedWorkOrder!]
    workOrdersByAssignedStaff: [DetailedWorkOrder!]
    workOrder(uuid: String!): DetailedWorkOrder
  }

  type Mutation {
    createWorkOrder(workType: String, priority: Int, detail: String, assignedStaff: String, accessInstruction: String, preferredTime: String, entryPermission: EntryPermission): DetailedWorkOrder
    changeWorkOrder(uuid: String!, workType: String, priority: Int, detail: String, assignedStaff: String, accessInstruction: String, preferredTime: String, entryPermission: EntryPermission): DetailedWorkOrder
    updateWorkOrderStatus(uuid: String!, status: WorkStatus!): DetailedWorkOrder
    uploadImages(uuid: String!, images: [String!]): DetailedWorkOrder
    cancelWorkOrder(uuid: String!): String
  }
`;
