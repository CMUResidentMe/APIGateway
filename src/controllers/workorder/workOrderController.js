import dotenv from 'dotenv';
dotenv.config();
import { request, gql, GraphQLClient } from 'graphql-request';

class WorkOrderController {

  constructor() {
    console.log(process.env.WORKORDER_CLIENT_URI);
    //this.client = new GraphQLClient(process.env.WORKORDER_CLIENT_URI);
    this.client = new GraphQLClient(process.env.WORKORDER_CLIENT_URI, { method: 'POST' });
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
          images
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
          images
        }
      }`;
      let variables = { 'ownerUuid': user };
      console.log(variables);
      let wks = await this.client.request(query, variables);
      return wks.workOrdersByOwner;
    } catch (error) {
      console.log("error", error);
      throw "getWorkOrders failed";
    }
  }

  async workOrdersUnassined() {
    try {
      let query = gql`
      {
        workOrdersUnassined{
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
          images
        }
      }`;
      let wks = await this.client.request(query);
      return wks.workOrders;
    } catch (error) {
      console.log("error", error);
      throw "workOrdersUnassined failed";
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
          images
        }
      }`;
      let variables = { 'assignedStaffUuid': user };
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
            images
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
        mutation createWorkOrder($owner: String!, $workType: String!, $priority: Priority!, $detail: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission, $images: [String!]) {
          createWorkOrder(owner: $owner, workType: $workType, priority: $priority, detail: $detail, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission, images: $images){
            uuid
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
        }
      `;
      const PORT = process.env.PORT || 2009;
    
      let newImages = [];
      workOrderContent.images.map( imagePath => {
        if(imagePath.startsWith("uploads")){//uploads
          let mewPath = imagePath.replaceAll("\\","/");
          mewPath = mewPath.replace("uploads/","");
          mewPath = `http://localhost:${PORT}/${mewPath}`;
          newImages.push(mewPath);
        }else{
          newImages.push(imagePath);
        }
      });
      workOrderContent.images = newImages;
      workOrderContent.owner = user;
      console.log(workOrderContent);
      let wk = await this.client.request(mutation, workOrderContent);
      return wk.createWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "createWorkOrder failed";
    }
  }

  async changeWorkOrder(woContent) {
    try {
      const mutation = gql`
        mutation changeWorkOrder($uuid: String!, $workType: String!, $priority: Priority!, $detail: String, $accessInstruction: String, $preferredTime: String, $entryPermission: EntryPermission, $images: [String!]) {
          changeWorkOrder(uuid: $uuid, workType: $workType, priority: $priority, detail: $detail, accessInstruction: $accessInstruction, preferredTime: $preferredTime, entryPermission: $entryPermission, images: $images) {
            uuid
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
        }
      `;
      let wk = await this.client.request(mutation, woContent);
      return wk.changeWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "changeWorkOrder failed";
    }
  }

  async updateWorkOrderStatus(woContent) {
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
      let wk = await this.client.request(mutation, woContent);
      return wk.updateWorkOrderStatus;
    } catch (error) {
      console.log("error", error);
      throw "updateWorkOrderStatus failed";
    }
  }

  async assignedStaff(woContent, user) {
    try {
      const mutation = gql`
      mutation assignedStaff($uuid: String!, $assignedStaff: String) {
        assignedStaff(uuid: $uuid, assignedStaff: $assignedStaff){
          uuid
          owner
          assignedStaff
          status
        }
      }
    `;
      woContent.assignedStaff = user;
      let wk = await this.client.request(mutation, woContent);
      return wk.assignedStaff;
    } catch (error) {
      console.log("error", error);
      throw "assignedStaff failed";
    }
  }

  async unAssignedStaff(woContent) {
    try {
      const mutation = gql`
      mutation assignedStaff($uuid: String!, $assignedStaff: String) {
        assignedStaff(uuid: $uuid, assignedStaff: $assignedStaff){
          uuid
          owner
          assignedStaff
          status
        }
      }
    `;
      let wk = await this.client.request(mutation, woContent);
      return wk.assignedStaff;
    } catch (error) {
      console.log("error", error);
      throw "assignedStaff failed";
    }
  }

  async cancelWorkOrder(woContent) {
    try {
      const mutation = gql`
        mutation cancelWorkOrder($uuid: String!) {
          cancelWorkOrder(uuid: $uuid){
            uuid
          }
        }
      `;
      let wk = await this.client.request(mutation, woContent);
      return wk.cancelWorkOrder;
    } catch (error) {
      console.log("error", error);
      throw "cancelWorkOrder failed";
    }
  }

}
const workOrderController = new WorkOrderController();
export { workOrderController };
