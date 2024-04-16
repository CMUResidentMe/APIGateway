import dotenv from 'dotenv';
dotenv.config();
import { request, gql, GraphQLClient } from 'graphql-request';

class WorkOrderController {

    constructor() {
        this.client = new GraphQLClient(process.env.WORKORDER_CLIENT_URI, { method: 'POST' });
        console.log('WorkOrder Service Client Initialized with URI:', process.env.WORKORDER_CLIENT_URI);
    }

    async getWorkOrders() {
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
        }
      }`;
        try {
            const data = await this.client.request(query);
            return data.workOrders;
        } catch (error) {
            console.error("Error retrieving work orders:", error);
            throw new Error("Failed to retrieve work orders.");
        }
    }

    async workOrdersByOwner(ownerUuid) {
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
        }
      }`;
        try {
            const data = await this.client.request(query, { ownerUuid });
            return data.workOrdersByOwner;
        } catch (error) {
            console.error("Error retrieving work orders by owner:", error);
            throw new Error("Failed to retrieve work orders by owner.");
        }
    }

    async createWorkOrder(workOrderDetails) {
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
        }
      }`;
        try {
            const data = await this.client.request(mutation, workOrderDetails);
            return data.createWorkOrder;
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
        }
      }`;
        try {
            const data = await this.client.request(mutation, workOrderDetails);
            return data.changeWorkOrder;
        } catch (error) {
            console.error("Error changing work order:", error);
            throw new Error("Failed to change work order.");
        }
    }

    async updateWorkOrderStatus(uuid, status) {
        const mutation = gql`
      mutation updateWorkOrderStatus($uuid: String!, $status: WorkStatus!) {
        updateWorkOrderStatus(uuid: $uuid, status: $status) {
          uuid
          semanticId
          status
        }
      }
    `;
        try {
            const variables = { uuid, status };
            const result = await this.client.request(mutation, variables);
            return result.updateWorkOrderStatus;
        } catch (error) {
            console.error("Error updating work order status:", error);
            throw new Error("Failed to update work order status.");
        }
    }

    async assignWorkOrderStaff(uuid, assignedStaff) {
        const mutation = gql`
      mutation assignStaff($uuid: String!, $assignedStaff: String!) {
        assignStaff(uuid: $uuid, assignedStaff: $assignedStaff) {
          uuid
          semanticId
          assignedStaff
          status
        }
      }
    `;
        try {
            const variables = { uuid, assignedStaff };
            const result = await this.client.request(mutation, variables);
            return result.assignStaff;
        } catch (error) {
            console.error("Error assigning staff to work order:", error);
            throw new Error("Failed to assign staff to work order.");
        }
    }

    async unassignWorkOrderStaff(uuid) {
        const mutation = gql`
      mutation unassignStaff($uuid: String!) {
        unassignStaff(uuid: $uuid) {
          uuid
          semanticId
          assignedStaff
          status
        }
      }
    `;
        try {
            const variables = { uuid };
            const result = await this.client.request(mutation, variables);
            return result.unassignStaff;
        } catch (error) {
            console.error("Error unassigning staff from work order:", error);
            throw new Error("Failed to unassign staff from work order.");
        }
    }

    async cancelWorkOrder(uuid) {
        const mutation = gql`
      mutation cancelWorkOrder($uuid: String!) {
        cancelWorkOrder(uuid: $uuid) {
          uuid
        }
      }
    `;
        try {
            const variables = { uuid };
            const result = await this.client.request(mutation, variables);
            return result.cancelWorkOrder;
        } catch (error) {
            console.error("Error canceling work order:", error);
            throw new Error("Failed to cancel work order.");
        }
    }


}

const workOrderController = new WorkOrderController();
export { workOrderController };
