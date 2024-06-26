import { gql } from 'apollo-server-express';

export const workOrderTypeDefs = gql`
  enum WorkStatus {
    OPEN
    ASSIGNED
    ONGOING
    FINISHED
  }

  enum EntryPermission {
    CALLCONFIRM
    KNOCKDOOR
    ALL_PERMISSIONS
  }

  enum Priority {
    High
    Medium
    Low
  }

  type User {
    username: String!
    firstName: String
    lastName: String
    roomNumber: Int
  }

  type DetailedWorkOrder {
    uuid: String!
    semanticId: String!
    owner: String!
    ownerInfo: User
    workType: String
    priority: Priority
    detail: String
    status: WorkStatus
    accessInstruction: String
    preferredTime: String
    entryPermission: EntryPermission
    images: [String!]
    assignedStaff: String
    staffInfo: User
    createTime: String
  }

  type Query {
    workOrders: [DetailedWorkOrder]
    workOrdersByOwner: [DetailedWorkOrder!]
    workOrdersUnassigned: [DetailedWorkOrder]
    workOrdersByAssignedStaff: [DetailedWorkOrder!]
    workOrdersByStatus(status: WorkStatus!): [DetailedWorkOrder!]
    workOrder(uuid: String!): DetailedWorkOrder
  }

  type CancelWorkOrderOutPut{
    uuid: String!
  }

  type Mutation {
    createWorkOrder(
      workType: String,
      priority: Priority,
      detail: String,
      accessInstruction: String,
      preferredTime: String,
      entryPermission: EntryPermission,
      images: [String!]
    ): DetailedWorkOrder

    changeWorkOrder(
      uuid: String!,
      workType: String,
      priority: Priority,
      detail: String,
      accessInstruction: String,
      preferredTime: String,
      entryPermission: EntryPermission,
      images: [String!]
    ): DetailedWorkOrder

    updateWorkOrderStatus(
      uuid: String!,
      status: WorkStatus!
    ): DetailedWorkOrder

    assignWorkOrderStaff(
      uuid: String!
    ): DetailedWorkOrder

    unassignWorkOrderStaff(
      uuid: String!
    ): DetailedWorkOrder

    cancelWorkOrder(
      uuid: String!
    ): CancelWorkOrderOutPut
  }
`;
