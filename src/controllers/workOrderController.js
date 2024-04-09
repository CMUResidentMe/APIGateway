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
          accessInstruction
          detail
          entryPermission
          owner
          preferredTime
          priority
          status
          workType
        }
      }`;
      let wks = await this.client.request(query);
      return wks.workOrders;
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
            accessInstruction
            detail
            entryPermission
            owner
            preferredTime
            priority
            status
            workType
          }
        }`;
      let wk = await this.client.request(query, woContent);
      return wk.workOrder;
    } catch (error) {
      console.log("error", error);
      throw "workOrder failed";
    }
  }

  async buildWorkOrder(workOrderContent, user) {
    try {
      const mutation = gql`
        mutation buildWorkOrder($owner: String!, $workType: String!, $priority: Int!, $detail: String, $preferredtime: String!, $entryPermission: EntryPermission, $accessInstruction: String) {
          buildWorkOrder(owner: $owner, workType: $workType, priority: $priority, detail: $detail, preferredtime: $preferredtime, entryPermission: $entryPermission, accessInstruction: $accessInstruction){
            uuid
            accessInstruction
            detail
            entryPermission
            owner
            preferredTime
            priority
            status
            workType
          }
        }
      `;
      workOrderContent.owner = user;
      let wk = await this.clientMutition.requestConfig(mutation, workOrderContent);
      return wk.buildWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "buildWorkOrder failed";
    }
  }

  async changeWorkOrder(woContent) {
    try {
      const mutation = gql`
        mutation changeWorkOrder($uuid: String!, $workType: String!, $priority: Int!, $detail: String) {
          changeWorkOrder(uuid: $uuid, workType: $workType, priority: $priority, detail: $detail) {
            uuid
            detail
            owner
            priority
            status
            workType
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

  async setPreferredtime(woContent){
    try {
      const mutation = gql`
        mutation setPreferredtime($uuid: String!, $preferredtime: String!) {
          setPreferredtime(uuid: $uuid, preferredtime: $preferredtime){
            uuid
            owner
            preferredtime
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setPreferredtime;
    } catch (error) {
      console.log("error", error);
      throw "setPreferredtime failed";
    }
  }

  async setAccessInstruction(woContent){
    try {
      const mutation = gql`
        mutation setAccessInstruction($uuid: String!, $accessInstruction: String) {
          setAccessInstruction(uuid: $uuid, accessInstruction: $accessInstruction){
            uuid
            owner
            accessInstruction
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setAccessInstruction;
    } catch (error) {
      console.log("error", error);
      throw "setAccessInstruction failed";
    }
  }

  async setStatus(woContent){
    try {
      const mutation = gql`
        mutation setStatus($uuid: String!, $status: WorkStatus!) {
          setStatus(uuid: $uuid, status: $status){
            uuid
            owner
            status
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setStatus;
    } catch (error) {
      console.log("error", error);
      throw "setStatus failed";
    }
  }

  async setPriority(woContent){
    try {
      const mutation = gql`
        mutation setPriority($uuid: String!, $priority: Int!) {
          setPriority(uuid: $uuid, priority: $priority){
            uuid
            owner
            priority
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setPriority;
    } catch (error) {
      console.log("error", error);
      throw "setPriority failed";
    }
  }

  async setAssignedstaff(woContent){
    try {
      const mutation = gql`
        mutation setAssignedstaff($uuid: String!, $assignedstaff: String) {
          setAssignedstaff(uuid: $uuid, assignedstaff: $assignedstaff){
            uuid
            owner
            assignedstaff
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setAssignedstaff;
    } catch (error) {
      console.log("error", error);
      throw "setAssignedstaff failed";
    }
  }

  async setEntryPermission(woContent){
    try {
      const mutation = gql`
        mutation setEntryPermission($uuid: String!, $entryPermission: EntryPermission) {
          setEntryPermission(uuid: $uuid, entryPermission: $entryPermission){
            uuid
            owner
            entryPermission
          }
        }
      `;
      let wk = await this.clientMutition.request(mutation, woContent);
      return wk.setAssignedstaff;
    } catch (error) {
      console.log("error", error);
      throw "setAssignedstaff failed";
    }
  }

}
const workOrderController = new WorkOrderController();
export { workOrderController };
