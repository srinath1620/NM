import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { IRoleAccess } from "../MarsConstants/ValidationContants";

export interface IMarsForm {
  context: FormCustomizerContext;
  displayMode: number;
}

export interface IOptions {
  key: string;
  text: string;
  disabled?: boolean;
}

export interface ILookUpColumn {
  key: string;
  text: string;
  dependentVal?: string;
}

export type IMarsText = {
  label: string;
  required: boolean;
  multiline?: boolean;
  type: string;
  name: string;
  val?: string | undefined;
  validation?: RegExp | boolean;
  MaxLen: number;
  placeholder?: string;
  disable?: boolean;
};

export type IErrMsgs = {
  PONumber: string;
  LadderPlan: string;
  Vendor: string;
  NBCStyle: string;
  NewVendor: string;
  NewNBCStyle: string;
  Cost: string;
  CompareAt: string;
  Retail: string;
  MARSCategory: string;
};

export interface IMarsNew {
  Division: string;
  RequestType: string;
  DistributionCenter: string[];
  MerchLocation: string;
  PONumber?: string;
  UnitsPerPlanning?: string;
  LadderPlan?: string;
  Page?: string;
  Line?: string;
  MARSDepartment?: string;
  Vendor?: string;
  VendorName?: string;
  MARSCategory?: string;
  NBCStyle: string;
  MerchType?: string;
  Cost?: string;
  CompareAt?: string;
  Retail?: string;
  ULine?: string;
  PreTicketed?: string;
  ControlFiles?: boolean;
  MarsStyleChange?: boolean;
  MARSDescription?: string;
  SpecialInstructions?: string;
  NewMARSDepartment: string;
  NewVendor: string;
  NewVendorName: string;
  NewMARSCategory: string;
  NewNBCStyle: string;
  NewMerchType: string;
  NewCost: string;
  NewCompareAt: string;
  NewRetail: string;
  NewULine: string;
  SubmitToPlanningMgr?: boolean;
  UpdatedPC?: string;
  MerchPrimaryApproverTitle?: string;
  MerchSecondaryApproverTitle?: string;
  MerchPrimaryApproverId?: number;
  MerchSecondaryApproverId?: number;
  MerchSign?: string;
  MerchSignDate?: string;
  MarsHistory?: string;
  MARSNextAction?: string;
  MarsUniqueID?: string;
  DistributionCenterId?: string[];
  MerchManagerApproved?: boolean;
  MerchManagerSign?: string;
  MerchManagerSignDate?: string;
  DCUnitsActedOn?: number;
  DCProcessed?: number;
  DCUnProcessed?: number;
  DCWorkCompletedByTitle?: string;
  DCWorkCompletedById?: number;
  DCOptions?: string;
  OverAllRetailImpact?: string;
  DCOptionComments?: string;
  PrintMARS?: boolean;
  DCApproved?: boolean;
  DCArchived?: boolean;
  DCReject?: boolean;
  DCPhysicallyReTicketed?: string;
  ReasonForReject?: string;
  DCComments?: string;
  DCSign?: string;
  DCSignDate?: string;
  dataLoaded?: boolean;
  DCApproverEmail?: string;
  FCTRX?: string;
  FCCode?: string;
  FCNewTRX?: string;
  FCNewCode?: string;
  FCSpecialInstructions?: string;
  FCDataEntryQuantity?: string;
  FCOptions?: string;
  FCApproved?: boolean;
  FCArchived?: boolean;
  FCRejected?: boolean;
  FCComments?: string;
  FCSign?: string;
  FCSignDate?: string;
}

export interface IMarsAllFeilds {
  Division: boolean;
  RequestType: boolean;
  DistributionCenter: boolean;
  MerchLocation: boolean;
  PONumber?: boolean;
  UnitsPerPlanning?: boolean;
  LadderPlan?: boolean;
  Page?: boolean;
  Line?: boolean;
  MARSDepartment?: boolean;
  Vendor?: boolean;
  VendorName?: boolean;
  MARSCategory?: boolean;
  NBCStyle?: boolean;
  MerchType?: boolean;
  Cost?: boolean;
  CompareAt?: boolean;
  Retail?: boolean;
  ULine?: boolean;
  PreTicketed?: boolean;
  ControlFiles?: boolean;
  MarsStyleChange?: boolean;
  MARSDescription?: boolean;
  SpecialInstructions?: boolean;
  NewMARSDepartment?: boolean;
  NewVendor?: boolean;
  NewVendorName?: boolean;
  NewMARSCategory?: boolean;
  NewNBCStyle?: boolean;
  NewMerchType?: boolean;
  NewCost?: boolean;
  NewCompareAt?: boolean;
  NewRetail?: boolean;
  NewULine?: boolean;
  SubmitToPlanningMgr?: boolean;
  UpdatedPC?: boolean;
  MerchPrimaryApproverTitle?: boolean;
  MerchSecondaryApproverTitle?: boolean;
  MerchPrimaryApproverId?: boolean;
  MerchSecondaryApproverId?: boolean;
  MerchSign?: boolean;
  MerchSignDate?: boolean;
  MerchManagerApproved?: boolean;
  MerchManagerSign?: boolean;
  DCUnitsActedOn?: boolean;
  MerchManagerSignDate?: boolean;
  DCWorkCompletedById?: boolean;
  DCOptions?: boolean;
  OverAllRetailImpact: boolean;
  DCOptionComments?: boolean;
  PrintMARS?: boolean;
  DCApproved?: boolean;
  DCArchived?: boolean;
  DCReject?: boolean;
  DCPhysicallyReTicketed?: boolean;
  ReasonForReject?: boolean;
  DCComments?: boolean;
  DCSign?: boolean;
  DCSignDate?: boolean;
  DCApproverEmail?: boolean;
  FCTRX?: boolean;
  FCCode?: boolean;
  FCNewTRX?: boolean;
  FCNewCode?: boolean;
  FCSpecialInstructions?: boolean;
  FCDataEntryQuantity?: boolean;
  FCOptions?: boolean;
  FCApproved?: boolean;
  FCArchived?: boolean;
  FCRejected?: boolean;
  FCComments?: boolean;
  FCSign?: boolean;
  FCSignDate?: boolean;
}

export interface IReqVals {
  submitClk: boolean;
  isRequestor?: boolean;
  isFC?: boolean;
  isDC?: boolean;
  isMerchAppOne?: boolean;
  isMerchAppTwo?: boolean;
  displayMode: number;
  DcOptions?: IOptions[];
  DcReTicketed?: IOptions[];
  DistributionCenter?: ILookUpColumn[];
  Division?: IOptions[];
  FCOptions?: IOptions[];
  MARSDepartment?: IOptions[];
  MerchLocation?: IOptions[];
  MerchType?: IOptions[];
  PreTicketed?: IOptions[];
  ReasonForReject?: IOptions[];
  RequestType?: IOptions[];
  userDispplayName?: string;
  enableSubmit?: boolean;
  toggleExpandCollapse: boolean;
  InitiatorEdit?: boolean;
  merchMgrEdit?: boolean;
  dcMgrEdit?: boolean;
  reqControls: string[];
  submitToPlanMgr: boolean;
  MerchManagerApproved: boolean | string;
  MerchManagerSign?: string;
  MerchManagerSignDate?: string;
  reticketCopy: boolean;
  newNbcError?: any;
  // dcStatus: boolean;
  // fcEdit: boolean;
  fcStatus: boolean;
  userGroups: string[];
  roleAccess: IRoleAccess;
  dcID: number;
}

export interface IOrgInfo {
  context: FormCustomizerContext;
}

export type IPeopleItems = {
  id: string;
  imageInitials?: string;
  imageUrl?: string;
  loginName: string;
  optionalText: string;
  secondaryText: string;
  tertiaryText: string;
  text: string;
};
