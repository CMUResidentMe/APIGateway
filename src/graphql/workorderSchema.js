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

  type WorkOrder{
    uuid: String!
    owner: String!
    workType: String
    priority: Int
    detail: String
    entryPermission: EntryPermission!
    status: WorkStatus!
    accessInstruction: String
    assignedStaff: String
  }

  type DetailedWorkOrder{
    uuid: String!
    preferredTime: String
    images: [String!]
  }

  type Query {
    workOrders: [WorkOrder]
    workOrder(uuid: String!): WorkOrder
  }

  type Mutation {
    buildWorkOrder(owner: String!, workType: String, priority: Int, detail: String, preferredtime: String, entryPermission: EntryPermission, accessInstruction: String): WorkOrder
    changeWorkOrder(uuid: String!, workType: String, priority: Int, detail: String): WorkOrder
    setPreferredtime(uuid: String!, preferredtime: String!): WorkOrder
    setEntryPermission(uuid: String!, entryPermission: EntryPermission!): WorkOrder
    setAccessInstruction(uuid: String!, accessInstruction: String!): WorkOrder
    setStatus(uuid: String!, status: WorkStatus!): WorkOrder
    setPriority(uuid: String!, priority: Int!): WorkOrder
    setAssignedstaff(uuid: String!, assignedStaff: String!): WorkOrder
  }
`;
