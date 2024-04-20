import dotenv from 'dotenv';
dotenv.config();
import { request, gql, GraphQLClient } from 'graphql-request';

const queryUser = gql`
      query getUserById($id: ID!){
        getUserById(id: $id) {
          username
          firstName
          lastName
          roomNumber
        }
      }`;

class WorkOrderController {

  constructor() {
    this.client = new GraphQLClient(process.env.WORKORDER_CLIENT_URI, { method: 'POST' });
    console.log('WorkOrder Service Client Initialized with URI:', process.env.WORKORDER_CLIENT_URI);
    this.clientUser = new GraphQLClient(process.env.USER_SERVICE_URL, { method: 'POST' });
  }

  async getUser(id){
    let variables = { 'id': id };
    let data = await this.clientUser.request(queryUser, variables);
    if(data !== null && data !== undefined){
      return {
        username: data.getUserById.username,
        firstName: data.getUserById.firstName,
        lastName: data.getUserById.lastName,
        roomNumber: data.getUserById.roomNumber,
      }
    } else{
      return undefined;
    }
    
  }

  async enrichUsres(workOrders) {
    let res = []
    for (let wk of workOrders) {
      wk.ownerInfo = await this.getUser(wk.owner);
      if (wk.assignedStaff !== null && wk.assignedStaff !== undefined) {
        wk.staffInfo = await this.getUser(wk.assignedStaff);
      }
      res.push(wk);
    }
    return res;
  }

  // Query
  async findAllWorkOrders() {
    const query = gql`
      query {
        workOrders {
          uuid
          semanticId
          owner
          workType
          priority
          detail
          status
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }`;
    try {
      let data = await this.client.request(query).workOrders;
      return this.enrichUsres(data.workOrders);
    } catch (error) {
      console.error("Error retrieving work orders:", error);
      throw new Error("Failed to retrieve work orders.");
    }
  }

  async findWorkOrdersByOwner(workOrderDetails, user) {
    const query = gql`
      query workOrdersByOwner($ownerUuid: String!) {
        workOrdersByOwner(ownerUuid: $ownerUuid) {
          uuid
          semanticId
          owner
          workType
          priority
          detail
          status
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }`;
    try {
      let variables = { 'ownerUuid': user };
      let data = await this.client.request(query, variables);
      return this.enrichUsres(data.workOrdersByOwner);
    } catch (error) {
      console.error("Error retrieving work orders by owner:", error);
      throw new Error("Failed to retrieve work orders by owner.");
    }
  }

  async findWorkOrdersByAssignedStaff(workOrderDetails, user) {
    const query = gql`
    query workOrdersByAssignedStaff($assignedStaffUuid: String!) {
      workOrdersByAssignedStaff(assignedStaffUuid: $assignedStaffUuid) {
        uuid
        semanticId
        owner
        workType
        priority
        detail
        status
        accessInstruction
        preferredTime
        entryPermission
        images
        assignedStaff
        createTime
      }
    }`;
    try {
      let variables = { 'assignedStaffUuid': user };
      let data = await this.client.request(query, variables);
      return this.enrichUsres(data.workOrdersByAssignedStaff);
    } catch (error) {
      console.error("Error retrieving work orders by assigned staff:", error);
      throw new Error("Failed to retrieve work orders by assigned staff.");
    }
  }

  async findWorkOrdersByStatus(workOrderDetails) {
    const query = gql`
    query workOrdersByStatus($status: WorkStatus!) {
      workOrdersByStatus(status: $status) {
        uuid
        semanticId
        owner
        workType
        priority
        detail
        status
        accessInstruction
        preferredTime
        entryPermission
        images
        assignedStaff
        createTime
      }
    }`;
    try {
      let data = await this.client.request(query, workOrderDetails);
      return this.enrichUsres(data.workOrdersByStatus);
    } catch (error) {
      console.error("Error retrieving work orders by status:", error);
      throw new Error("Failed to retrieve work orders by status.");
    }
  }
  
  async findOneWorkOrder(workOrderDetails) {
    const query = gql`
    query workOrder($uuid: String!) {
      workOrder(uuid: $uuid) {
        uuid
        semanticId
        owner
        workType
        priority
        detail
        status
        accessInstruction
        preferredTime
        entryPermission
        images
        assignedStaff
        createTime
      }
    }`;
    try {
      let data = await this.client.request(query, workOrderDetails);
      return data.workOrder;
    } catch (error) {
      console.error("Error retrieving work order:", error);
      throw new Error("Failed to retrieve work order.");
    }
  }

  // Mutation
  async createWorkOrder(workOrderDetails, user) {
    console.log("Creating new work order with details:", workOrderDetails);
    const mutation = gql`
      mutation createWorkOrder($owner: String!, $workType: String!, $priority: Priority!, $detail: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission, $images: [String!]) {
        createWorkOrder(owner: $owner, workType: $workType, priority: $priority, detail: $detail, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission, images: $images) {
          uuid
          semanticId
          owner
          workType
          priority
          status
          detail
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }`;

    try {
      const PORT = process.env.PORT || 2009;
      let newImages = [];
      workOrderDetails.images.map(imagePath => {
        if (imagePath.startsWith("uploads")) {//uploads
          let mewPath = imagePath.replaceAll("\\", "/");
          mewPath = mewPath.replace("uploads/", "");
          mewPath = `http://localhost:${PORT}/${mewPath}`;
          newImages.push(mewPath);
        } else {
          newImages.push(imagePath);
        }
      });
      workOrderDetails.images = newImages;
      workOrderDetails.owner = user;
      console.log(workOrderDetails);
      let wk = await this.client.request(mutation, workOrderDetails);
      return wk.createWorkOrder;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw new Error("Failed to create work order.");
    }
  }

  async changeWorkOrder(workOrderDetails) {
    const mutation = gql`
      mutation changeWorkOrder($uuid: String!, $workType: String, $priority: Priority, $detail: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission, $images: [String!]) {
        changeWorkOrder(uuid: $uuid, workType: $workType, priority: $priority, detail: $detail, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission, images: $images) {
          uuid
          semanticId
          owner
          workType
          priority
          status
          detail
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }`;
    try {
      let data = await this.client.request(mutation, workOrderDetails);
      return data.changeWorkOrder;
    } catch (error) {
      console.error("Error changing work order:", error);
      throw new Error("Failed to change work order.");
    }
  }

  async updateWorkOrderStatus(workOrderDetails) {
    const mutation = gql`
      mutation updateWorkOrderStatus($uuid: String!, $status: WorkStatus!) {
        updateWorkOrderStatus(uuid: $uuid, status: $status) {
          uuid
          semanticId
          owner
          workType
          priority
          detail
          status
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }
    `;
    try {
      let result = await this.client.request(mutation, workOrderDetails);
      return result.updateWorkOrderStatus;
    } catch (error) {
      console.error("Error updating work order status:", error);
      throw new Error("Failed to update work order status.");
    }
  }

  async assignWorkOrderStaff(workOrderDetails, user) {
    const mutation = gql`
      mutation assignWorkOrderStaff($uuid: String!, $assignedStaff: String!) {
        assignWorkOrderStaff(uuid: $uuid, assignedStaff: $assignedStaff) {
          uuid
          semanticId
          owner
          workType
          priority
          detail
          status
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }
    `;
    try {
      workOrderDetails.assignedStaff = user;
      let result = await this.client.request(mutation, workOrderDetails);
      return result.assignWorkOrderStaff;
    } catch (error) {
      console.error("Error assigning staff to work order:", error);
      throw new Error("Failed to assign staff to work order.");
    }
  }

  async unassignWorkOrderStaff(workOrderDetails) {
    const mutation = gql`
      mutation unassignWorkOrderStaff($uuid: String!) {
        unassignWorkOrderStaff(uuid: $uuid) {
          uuid
          semanticId
          owner
          workType
          priority
          detail
          status
          accessInstruction
          preferredTime
          entryPermission
          images
          assignedStaff
          createTime
        }
      }
    `;
    try {
      let result = await this.client.request(mutation, workOrderDetails);
      return result.unassignWorkOrderStaff;
    } catch (error) {
      console.error("Error unassigning staff from work order:", error);
      throw new Error("Failed to unassign staff from work order.");
    }
  }

  async cancelWorkOrder(workOrderDetails) {
    const mutation = gql`
      mutation cancelWorkOrder($uuid: String!) {
        cancelWorkOrder(uuid: $uuid) {
          uuid
        }
      }
    `;
    try {
      let result = await this.client.request(mutation, workOrderDetails);
      return result.cancelWorkOrder;
    } catch (error) {
      console.error("Error canceling work order:", error);
      throw new Error("Failed to cancel work order.");
    }
  }

}

const workOrderController = new WorkOrderController();
export { workOrderController };
