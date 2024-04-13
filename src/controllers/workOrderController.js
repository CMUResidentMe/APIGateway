import dotenv from 'dotenv';
dotenv.config();
import { request, gql, GraphQLClient } from 'graphql-request';

class WorkOrderController {
  
  constructor(){
    console.log(process.env.WORKORDER_CLIENT_URI);
    this.client = new GraphQLClient(process.env.WORKORDER_CLIENT_URI);
    this.clientMutition = new GraphQLClient(process.env.WORKORDER_CLIENT_URI, { method: 'POST' });
  }

  async getWorkOrders() {
    try {
      let query = gql`
      {
        workOrders{
          uuid
          owner
          workType
          priority
          status
          detail
          assignedStaff
          accessInstruction
          preferredTime
          entryPermission
        }
      }`;
      let wks = await this.client.request(query);
      return wks.workOrders;
    } catch (error) {
      console.log("error", error);
      throw "getWorkOrders failed";
    }
  }

  async workOrdersByOwner(woContent, user) {
    try {
      let query = gql`
      query workOrdersByOwner($ownerUuid: String!) {
        workOrdersByOwner(ownerUuid: $ownerUuid){
          uuid
          owner
          workType
          priority
          status
          detail
          assignedStaff
          accessInstruction
          preferredTime
          entryPermission
        }
      }`;
      let variables = {'ownerUuid': user};
      console.log(variables);
      let wks = await this.client.request(query, variables);
      return wks.workOrdersByOwner;
    } catch (error) {
      console.log("error", error);
      throw "getWorkOrders failed";
    }
  }

  async workOrdersByAssignedStaff(woContent, user) {
    try {
      let query = gql`
      query workOrdersByAssignedStaff($assignedStaffUuid: String!) {
        workOrdersByAssignedStaff(assignedStaffUuid: $assignedStaffUuid){
          uuid
          owner
          workType
          priority
          status
          detail
          assignedStaff
          accessInstruction
          preferredTime
          entryPermission
        }
      }`;
      let variables = {'assignedStaffUuid': user};
      let wks = await this.client.request(query, variables);
      return wks.workOrdersByAssignedStaff;
    } catch (error) {
      console.log("error", error);
      throw "getWorkOrders failed";
    }
  }
  async getWorkOrder(woContent) {
    try {
      let query = gql`
        query workOrder($uuid: String!) {
          workOrder(uuid: $uuid){
            uuid
            owner
            workType
            priority
            status
            detail
            assignedStaff
            accessInstruction
            preferredTime
            entryPermission
          }
        }`;
      let wk = await this.client.request(query, woContent);
      return wk.workOrder;
    } catch (error) {
      console.log("error", error);
      throw "workOrder failed";
    }
  }

  async createWorkOrder(workOrderContent, user) {
    try {
      const mutation = gql`
        mutation createWorkOrder($owner: String!, $workType: String!, $priority: Int!, $detail: String, $assignedStaff: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission) {
          createWorkOrder(owner: $owner, workType: $workType, priority: $priority, detail: $detail, assignedStaff: $assignedStaff, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission){
            uuid
            owner
            workType
            priority
            status
            detail
            assignedStaff
            accessInstruction
            preferredTime
            entryPermission
          }
        }
      `;
      workOrderContent.owner = user;
      let wk = await this.clientMutition.request(mutation, workOrderContent);
      return wk.createWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "createWorkOrder failed";
    }
  }

  async changeWorkOrder(woContent) {
    try {
      const mutation = gql`
        mutation changeWorkOrder($uuid: String!, $workType: String!, $priority: Int!, $detail: String, $assignedStaff: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission) {
          changeWorkOrder(uuid: $uuid, workType: $workType, priority: $priority, detail: $detail, assignedStaff: $assignedStaff, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission) {
            uuid
            owner
            workType
            priority
            status
            detail
            assignedStaff
            accessInstruction
            preferredTime
            entryPermission
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.changeWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "changeWorkOrder failed";
    }
  }

  async updateWorkOrderStatus(woContent){
    try {
      const mutation = gql`
        mutation updateWorkOrderStatus($uuid: String!, $status: WorkStatus!) {
          updateWorkOrderStatus(uuid: $uuid, status: $status){
            uuid
            owner
            assignedStaff
            status
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.updateWorkOrderStatus;
    } catch (error) {
      console.log("error", error);
      throw "updateWorkOrderStatus failed";
    }
  }

  async cancelWorkOrder(woContent){
    try {
      const mutation = gql`
        mutation cancelWorkOrder($uuid: String!) {
          cancelWorkOrder(uuid: $uuid){
            uuid
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.cancelWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "cancelWorkOrder failed";
    }
  }

}
const workOrderController = new WorkOrderController();
export { workOrderController };
