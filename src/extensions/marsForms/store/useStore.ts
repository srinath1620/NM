import create from "zustand";
import {
  IMarsNew,
  IMarsAllFeilds,
  IReqVals,
} from "../components/Interfaces/IMarsForm";
import { ReqForm_AllFeilds } from "../components/MarsConstants/Constants";

interface AppState {
  marsNew: IMarsNew;
  reqValues: IReqVals;
  marsReqValidation: IMarsAllFeilds;
  marsItem: any;
  updateMarsNew: (updates: Partial<IMarsNew>) => void;
  updateReqValues: (updates: Partial<IReqVals>) => void;
  updateMarsReqValidation: (updates: Partial<IMarsAllFeilds>) => void;
  updateMarsItems: (updates: Partial<any>) => void;
}

export const useStore = create<AppState>((set) => ({
  marsNew: {
    Division: "",
    RequestType: "",
    DistributionCenter: [],
    MerchLocation: "",
    PONumber: "",
    UnitsPerPlanning: "",
    LadderPlan: "",
    Page: "",
    Line: "",
    MARSDepartment: "",
    Vendor: "",
    VendorName: "",
    MARSCategory: "",
    NBCStyle: "",
    MerchType: "",
    Cost: "",
    CompareAt: "",
    Retail: "",
    ULine: "",
    PreTicketed: "",
    ControlFiles: false,
    MarsStyleChange: false,
    MARSDescription: "",
    SpecialInstructions: "",
    NewMARSDepartment: "",
    NewVendor: "",
    NewVendorName: "",
    NewMARSCategory: "",
    NewNBCStyle: "",
    NewMerchType: "",
    NewCost: "",
    NewCompareAt: "",
    NewRetail: "",
    NewULine: "",
    SubmitToPlanningMgr: false,
    UpdatedPC: "",
    MerchPrimaryApproverTitle: "",
    MerchSecondaryApproverTitle: "",
    MerchPrimaryApproverId: 0,
    MerchSecondaryApproverId: 0,
    MerchSign: "",
    MerchSignDate: "",
    MerchManagerApproved: false,
    MerchManagerSign: "",
    MerchManagerSignDate: "",
    DCOptions: "",
    OverAllRetailImpact: "",
    dataLoaded: false,
    DCWorkCompletedById: 0,
  },
  reqValues: {
    dcID: 0,
    isRequestor: false,
    isFC: false,
    isDC: false,
    isMerchAppOne: false,
    isMerchAppTwo: false,
    userGroups: [],
    roleAccess: {
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
    },
    submitClk: false,
    url: "",
    displayMode: 0,
    userDispplayName: "",
    enableSubmit: false,
    toggleExpandCollapse: true,
    InitiatorEdit: false,
    merchMgrEdit: false,
    dcMgrEdit: false,
    fcStatus: false,
    reqControls: [],
    submitToPlanMgr: false,
    MerchManagerApproved: "",
    reticketCopy: false,
    newNbcError: {
      styleChange: false,
      nbcStyle: "",
      newNbcStyle: "",
      errMsg: "",
    },
  },
  marsReqValidation: ReqForm_AllFeilds,
  marsItem: {},
  updateMarsNew: (updates) =>
    set((state) => ({
      marsNew: { ...state.marsNew, ...updates },
    })),
  updateReqValues: (updates) =>
    set((state) => ({
      reqValues: { ...state.reqValues, ...updates },
    })),
  updateMarsReqValidation: (updates) =>
    set((state) => ({
      marsReqValidation: { ...state.marsReqValidation, ...updates },
    })),
  updateMarsItems: (updates) =>
    set((state) => ({
      marsItem: { ...state.marsItem, ...updates },
    })),
}));
