import { LocInquiry_Disable, LocInquiry_Req } from "./Constants";
import { ReTicket_Req } from "./MerchConstants";

export const MARS_Initiators = ["MARS-Merchandise-Initiators", "mars Owners"];
export const MERCH_MANAGERS = ["MARS-Merchandise-Managers", "mars Owners"];
export const MARS_DC = ["MARS-DC-Members"];
export const MARS_FC = ["MARS-FC-Members"];

export const giveDisableAndReq = (
  type: string,
  name: string,
  DivType: string,
  DcOpt: string
): { req: boolean; disabled: boolean } => {
  const req_dis = { req: false, disabled: false };
  switch (type) {
    case "Reticket Form":
      if (ReTicket_Req.indexOf(name) > -1) {
        req_dis.req = true;
      }
      if (name === "UnitsPerPlanning") {
        req_dis.disabled = true;
      }
      if (
        ((name === "ULine" || name === "NewULine") &&
          DivType !== "Marshalls") ||
        name === "OverAllRetailImpact"
      ) {
        req_dis.disabled = true;
      }
      if (
        name === "DCUnitsActedOn" ||
        name === "DCProcessed" ||
        name === "OverAllRetailImpact" ||
        name === "DCOptions" ||
        name === "DCComments"
      ) {
        req_dis.req = true;
      }
      // if (name === "DCOptionComments" && DcOpt === "Other(Add Comments)") {
      //   req_dis.req = true;
      // }
      if (["MARSDepartment", "MerchType"].indexOf(name) > -1) {
        req_dis.req = true;
      }
      break;
    case "Locator Inquiry":
      if (LocInquiry_Req.indexOf(name) > -1) {
        req_dis.req = true;
      }
      if (
        LocInquiry_Disable.indexOf(name) > -1 ||
        name === "OverAllRetailImpact"
      ) {
        req_dis.disabled = true;
      }
      if (
        //(name === "DCOptionComments" && DcOpt === "Other(Add Comments)") ||
        name === "DCProcessed"
      ) {
        req_dis.req = true;
      }
      if (
        name === "DCUnitsActedOn" ||
        name === "DCOptions" ||
        name === "DCComments"
      ) {
        req_dis.req = true;
      }
      break;
    default:
      break;
  }
  return req_dis;
};

export type IRoleAccess = {
  rqRequestor: boolean;
  rqMerchMgr: boolean;
  rqDcMgr: boolean;
  rqFcMgr: boolean;
  disReqForm: boolean;
  disMerchMgrForm: boolean;
  disDcForm: boolean;
  disFcForm: boolean;
  enableFcAll: boolean;
  editBtnTxt: string;
  disEditBtn: boolean;
  usrErrMsg: string;
};

export const getRoleBasedEditControls = (
  roles: string[],
  reqStatus: string,
  reqType: string,
  apprOne: string,
  apprTwo: string,
  currUser: string,
  author: string
): IRoleAccess => {
  const roleAccess: IRoleAccess = {
    rqRequestor: false,
    rqMerchMgr: false,
    rqDcMgr: false,
    rqFcMgr: false,
    disReqForm: true,
    disMerchMgrForm: true,
    disDcForm: true,
    disFcForm: true,
    enableFcAll: false,
    editBtnTxt: "",
    disEditBtn: true,
    usrErrMsg: "",
  };

  if (author === currUser) {
    roleAccess.rqRequestor = true;
  }
  if (reqType === "Reticket Form") {
    if (reqStatus === "Approved") {
      roleAccess.enableFcAll = true;
      roles.forEach((grp) => {
        if (MARS_FC.indexOf(grp) > -1) {
          roleAccess.rqFcMgr = true;
        }
      });
    }
    if (
      reqStatus === "Awaiting for Merch Approval" ||
      reqStatus === "Rejected by DC"
    ) {
      roleAccess.editBtnTxt = "Edit as Merch Initiator";

      if (apprOne === currUser || apprTwo === currUser) {
        roleAccess.rqMerchMgr = true;
      } else {
        roleAccess.usrErrMsg =
          "You need to be in Merch group to be able to edit/approve the request.";
      }

      if (author === currUser) {
        roleAccess.rqRequestor = true;
        roleAccess.disEditBtn = false;
        roleAccess.usrErrMsg = "";
      }
    } else if (reqStatus === "Awaiting for DC Approval") {
      roleAccess.editBtnTxt = "Edit as Merch Manager";
      if (apprOne === currUser || apprTwo === currUser) {
        roleAccess.rqMerchMgr = true;
        roleAccess.disEditBtn = false;
      }
      roles.forEach((grp) => {
        if (MARS_DC.indexOf(grp) > -1) {
          roleAccess.rqDcMgr = true;
        }
      });

      if (!roleAccess.rqDcMgr) {
        roleAccess.usrErrMsg =
          "You need to be DC group to be able to edit/approve the request.";
      }
    } else if (
      reqStatus === "Awaiting for FC Approval" ||
      reqStatus === "Rejected by FC" ||
      "Archived by DC"
    ) {
      roleAccess.editBtnTxt = "Edit as DC Approver";
      roles.forEach((grp) => {
        if (MARS_DC.indexOf(grp) > -1) {
          roleAccess.rqDcMgr = true;
          roleAccess.disEditBtn = false;
        }
        if (MARS_FC.indexOf(grp) > -1) {
          roleAccess.rqFcMgr = true;
        }
      });

      if (!roleAccess.rqFcMgr) {
        roleAccess.usrErrMsg =
          "You need to be FC group to be able to edit/approve the request.";
      }
    }
  } else if (reqType === "Locator Inquiry") {
    if (reqStatus === "Approved") {
      roleAccess.enableFcAll = true;
      roles.forEach((grp) => {
        if (MARS_FC.indexOf(grp) > -1) {
          roleAccess.rqFcMgr = true;
        }
      });
    }
    if (
      reqStatus === "Awaiting for DC Approval" ||
      reqStatus === "Rejected by DC"
    ) {
      roleAccess.editBtnTxt = "Edit as Merch Initiator";
      roles.forEach((grp) => {
        if (author === currUser) {
          roleAccess.rqRequestor = true;
          roleAccess.disEditBtn = false;
        }
        if (MARS_DC.indexOf(grp) > -1) {
          roleAccess.rqDcMgr = true;
        }
      });
      if (!roleAccess.rqDcMgr) {
        roleAccess.usrErrMsg =
          "You need to be DC group to be able to edit/approve the request.";
      }
    } else if (
      reqStatus === "Awaiting for FC Approval" ||
      reqStatus === "Rejected by FC" ||
      "Archived by DC"
    ) {
      roleAccess.editBtnTxt = "Edit as DC Approver";
      roles.forEach((grp) => {
        if (MARS_DC.indexOf(grp) > -1) {
          roleAccess.rqDcMgr = true;
          roleAccess.disEditBtn = false;
        }
        if (MARS_FC.indexOf(grp) > -1) {
          roleAccess.rqFcMgr = true;
        }
      });
      if (!roleAccess.rqFcMgr && reqStatus !== "Archived by DC") {
        roleAccess.usrErrMsg =
          "You need to be FC group to be able to edit/approve the request.";
      }
    }
  } else {
    if (
      reqStatus === "Awaiting for DC Approval" ||
      reqStatus === "Rejected by DC"
    ) {
      roleAccess.editBtnTxt = "Edit as Merch Initiator";
      roles.forEach((grp) => {
        if (author === currUser) {
          roleAccess.rqRequestor = true;
          roleAccess.disEditBtn = false;
        }
        if (MARS_DC.indexOf(grp) > -1) {
          roleAccess.rqDcMgr = true;
        }
      });
      if (!roleAccess.rqDcMgr) {
        roleAccess.usrErrMsg =
          "You need to be DC group to be able to edit/approve the request.";
      }
    }
  }

  return roleAccess;
};

export const FcVConstants = {
  PONumber: true,
  UnitsPerPlanning: true,
  LadderPlan: true,
  Page: true,
  Line: true,
  MARSDepartment: true,
  Vendor: true,
  VendorName: true,
  MARSCategory: true,
  NBCStyle: true,
  MerchType: true,
  Cost: true,
  CompareAt: true,
  Retail: true,
  ULine: true,
  PreTicketed: true,
  ControlFiles: true,
  MarsStyleChange: true,
  MARSDescription: true,
  SpecialInstructions: true,
  NewVendor: true,
  NewNBCStyle: true,
  NewVendorName: true,
  NewMARSCategory: true,
  NewULine: true,
  NewCost: true,
  NewRetail: true,
  NewCompareAt: true,
  NewMARSDepartment: true,
  NewMerchType: true,
  DCUnitsActedOn: true,
  DCWorkCompletedById: true,
  DCOptions: true,
  OverAllRetailImpact: true,
  DCOptionComments: true,
  PrintMARS: true,
};
