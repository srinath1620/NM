import * as React from "react";
import { IMarsAllFeilds, IMarsForm, IMarsNew } from "../Interfaces/IMarsForm";
import {
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
  Overlay,
  Spinner,
  SpinnerSize,
  DefaultButton,
} from "@fluentui/react";
import {
  Accordion as Acc,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import styles from "../MarsForms.module.scss";
import OriginalInformation from "../Controls/Panels/OriginalInformation";
import MerchandiseApproval from "../Controls/Panels/MerchandiseApproval";
import { DcApproval, DcInformation } from "../Controls/Panels/DcInformation";
import { FcApproval, FcInformation } from "../Controls/Panels/FcInformation";
import {
  getCurrentUserGroups,
  getItem,
  getListColumns,
  updateItem,
  addItem,
} from "../services/services";
import * as moment from "moment";
import { MarsLabel, MarsTooltipLabel } from "../Controls/UI/Labels";
import { useStore } from "../../store/useStore";
import { ReTicket_AllFeilds } from "../MarsConstants/MerchConstants";
import { Req_DcPanel } from "../MarsConstants/Constants";
import { getRoleBasedEditControls } from "../MarsConstants/ValidationContants";

const MarsEditForm = (props: IMarsForm): JSX.Element => {
  const {
    marsNew,
    reqValues,
    updateReqValues,
    marsReqValidation,
    updateMarsNew,
    marsItem,
    updateMarsItems,
  } = useStore();
  const [showLoader, setShowLoader] = React.useState<boolean>(false);
  const [userErr, setUserErr] = React.useState<string>("");
  const [editBtn, setEditBtn] = React.useState<string>("");

  const decodeHtmlEntities = (encodedString: string) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
  };

  const buildHistory = (reqStatus: string): string => {
    if (marsItem?.MarsHistory !== "") {
      const history = JSON.parse(decodeHtmlEntities(marsItem?.MarsHistory));
      history.push({
        RevisiedBy: reqValues.userDispplayName,
        DateTime:
          new Date().toDateString() + " " + new Date().toLocaleTimeString(),
        Change:
          marsItem.MARSNextAction !== "Approved" ? reqStatus : "Edited By FC",
      });
      return JSON.stringify(history);
    } else {
      return "";
    }
  };

  const ValidateLocInq = (changedControls: Set<string>) => {
    let erroredFeilds = "";
    changedControls.forEach((feild: string) => {
      if (!marsNew[feild as keyof IMarsAllFeilds]) {
        erroredFeilds += feild + ", ";
      }
    });
    console.log("test 3 - ", erroredFeilds);
    if (erroredFeilds !== "") {
      return false;
    } else {
      return true;
    }
  };

  const validateReticket = (
    changedControls: Set<string>,
    type: string
  ): boolean => {
    let erroredFeilds = "";
    //const changedControls = new Set<string>(reqValues.reqControls);
    if (type === "DC") {
      if (
        marsNew.DCWorkCompletedById === 0 ||
        marsNew.DCWorkCompletedById === undefined
      ) {
        erroredFeilds += "Fix the mandatory feilds.";
      }
      if (
        (!marsNew.DCUnitsActedOn && marsNew.DCUnitsActedOn !== 0) ||
        !marsNew.DCProcessed ||
        !marsNew.DCOptions ||
        !marsNew.DCComments
      ) {
        erroredFeilds += "Fix the mandatory feilds.";
      }
      if (marsNew.DCProcessed === null || marsNew.DCProcessed === undefined) {
        erroredFeilds += "Fix the mandatory feilds.";
      }
      if (!marsNew.DCReject && !marsNew.DCApproved && !marsNew.DCArchived) {
        erroredFeilds += "Fix the mandatory feilds.";
      }
      if (
        marsNew.DCReject &&
        (!marsNew.ReasonForReject ||
          marsNew.ReasonForReject === "Select a reason")
      ) {
        // if (
        //   marsNew.DCOptions === "Other(Add Comments)" &&
        //   !marsNew.DCOptionComments
        // ) {
        //   erroredFeilds += "Fix DC Comments.";
        // }
        // if (
        //   marsNew.RequestType === "Reticket Form" &&
        //   !marsNew.DCPhysicallyReTicketed
        // ) {
        //   erroredFeilds += "Fix Retciketed.";
        // }
        erroredFeilds += "Fix Reject Reason.";
      }
      if (erroredFeilds !== "") {
        console.log(erroredFeilds);
        return false;
      } else {
        return true;
      }
    } else if (type === "MERCH") {
      const reqBool = ValidateLocInq(changedControls);
      if (reqBool) {
        return reqBool;
      } else {
        setShowLoader(false);
        return false;
      }
    } else {
      if (changedControls.size > 0) {
        changedControls.forEach((chng: string) => {
          if (
            chng !== "MarsStyleChange" &&
            chng !== "NewNBCStyle" &&
            chng !== "NBCStyle"
          ) {
            // if (
            //   (chng === "DCOptions" || chng === "DCOptionComments") &&
            //   marsNew.DCOptions === "Other(Add Comments)" &&
            //   !marsNew.DCOptionComments
            // ) {
            //   erroredFeilds += chng + ", ";
            // }
            if (
              !marsReqValidation[chng as keyof IMarsAllFeilds] &&
              chng !== "FCApproved" &&
              chng !== "FCArchived" &&
              chng !== "FCRejected"
            ) {
              erroredFeilds += chng + ", ";
            } else {
              console.log(
                `col - ${chng} - ${marsNew[chng as keyof IMarsAllFeilds]}`
              );
            }
          } else {
            // const styleChamge = marsNew.MarsStyleChange
            //   ? marsNew.MarsStyleChange
            //   : marsItem.MarsStyleChange;
            if (marsNew.MarsStyleChange && marsNew.NewNBCStyle !== "") {
              const nbc =
                marsNew.NBCStyle !== "" ? marsNew.NBCStyle : marsItem.NBCStyle;
              if (nbc === marsNew.NewNBCStyle) {
                erroredFeilds += chng + ", ";
              }
            }
          }
        });
        console.log("Errored Feilds - ", erroredFeilds);
        return erroredFeilds !== "" ? false : true;
      } else {
        console.log("No Feilds updated - ", erroredFeilds);
        return true;
      }
    }
  };

  const currentItemUpdate = (
    changedControls: Set<string> | string[],
    status: string,
    type: string,
    DistID?: number[]
  ): void => {
    const itemUpdate: any = {};
    itemUpdate.MARSNextAction = status;
    changedControls.forEach((rqItem: string) => {
      if (rqItem === "MerchSignDate") {
        itemUpdate[rqItem] = moment(marsNew.MerchSignDate);
      } else if (rqItem === "MerchManagerSignDate") {
        itemUpdate[rqItem] =
          marsNew.MerchManagerSignDate !== ""
            ? moment(marsNew.MerchManagerSignDate)
            : null;
      } else if (rqItem === "DCSignDate") {
        itemUpdate[rqItem] = moment(marsNew.DCSignDate);
      } else if (rqItem === "FCSignDate") {
        itemUpdate[rqItem] = moment(marsNew.FCSignDate);
      } else {
        itemUpdate[rqItem] = marsNew[rqItem as keyof IMarsNew];
      }
    });
    if (DistID) {
      itemUpdate.DistributionCenterId = DistID;
    }
    if (type === "MERCH") {
      //Edited By Initiator
      itemUpdate.MarsHistory = buildHistory(status);
    } else if (type === "MERCHMGR") {
      //"Edited By Merch Manager"
      itemUpdate.MarsHistory = buildHistory(status);
    } else if (type === "DC") {
      const status = marsNew.DCReject
        ? "Rejected by DC"
        : marsNew.DCApproved
        ? "Awaiting for FC Approval"
        : "Archived by DC";
      itemUpdate.MarsHistory = buildHistory(status);
      itemUpdate.MARSNextAction = status;
    } else if (type === "FC") {
      const status =
        marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
          ? marsNew.FCRejected
            ? "Rejected by FC"
            : "Approved"
          : "Awaiting for FC Approval";
      itemUpdate.MarsHistory = buildHistory(status);
      itemUpdate.MARSNextAction = status;
    }

    console.log("Item to be updated - ", itemUpdate, marsNew);
    updateItem(props.context, marsItem.ID, itemUpdate)
      .then((item) => {
        console.log(item);
        setShowLoader(false);
        window.location.href = document.referrer;
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  const submitHandler = (): void => {
    setShowLoader(true);
    updateReqValues({
      submitClk: true,
    });
    const changedControls = new Set<string>(reqValues.reqControls);
    if (changedControls.size > 0) {
      if (marsItem.RequestType === "Reticket Form") {
        if (reqValues.InitiatorEdit) {
          if (validateReticket(changedControls, "MERCH")) {
            currentItemUpdate(
              changedControls,
              "Awaiting for Merch Approval",
              "MERCH"
            );
          } else {
            return;
          }
        } else if (marsItem.MARSNextAction === "Awaiting for Merch Approval") {
          if (marsNew.MerchManagerApproved) {
            const currDistId = marsNew.DistributionCenter.pop();
            if (currDistId) {
              currentItemUpdate(
                changedControls,
                "Awaiting for DC Approval",
                "MERCH",
                [parseInt(currDistId)]
              );
            }
            const itemUpdate: any = {};
            ReTicket_AllFeilds.forEach((feild) => {
              if (feild !== "DistributionCenter")
                itemUpdate[feild] = marsItem[feild];
            });
            itemUpdate.MarsHistory = buildHistory("Awaiting for DC Approval");
            itemUpdate.MarsUniqueID = marsItem?.MarsUniqueID;
            itemUpdate.MARSNextAction = "Awaiting for DC Approval";
            itemUpdate.MerchManagerApproved = marsNew.MerchManagerApproved;
            itemUpdate.MerchManagerSign = marsNew.MerchManagerSign;
            itemUpdate.MerchManagerSignDate = moment();
            console.log(`Items to be added - `, itemUpdate);
            marsNew.DistributionCenter &&
              marsNew.DistributionCenter.forEach((dc, ind) => {
                itemUpdate.DistributionCenterId = [parseInt(dc)];
                addItem(props.context, itemUpdate)
                  .then((result: any) => {
                    console.log(`New Item added - `, result, ind);
                    window.location.href = document.referrer;
                  })
                  .catch((error) => {
                    console.log(
                      `Something went wrong in creating item - `,
                      error
                    );
                  });
              });
          } else {
            const itemUpdate: any = {};
            itemUpdate.MarsHistory = buildHistory(
              "Awaiting for Merch Approval"
            );
            itemUpdate.MARSNextAction = "Awaiting for Merch Approval";
            itemUpdate.MerchManagerApproved = false;
            itemUpdate.MerchManagerSign = "";
            itemUpdate.MerchManagerSignDate = null;
            console.log("Item to be updated - ", itemUpdate);
            updateItem(props.context, marsItem.ID, itemUpdate)
              .then((item) => {
                console.log(item);
                setShowLoader(false);
                window.location.href = document.referrer;
              })
              .catch((err) => {
                console.log(err);
                setShowLoader(false);
              });
          }
        } else if (
          [
            "Awaiting for DC Approval",
            "Archived by DC",
            "Rejected by DC",
            "Rejected by FC",
          ].indexOf(marsItem.MARSNextAction) > -1
        ) {
          if (reqValues.merchMgrEdit && !marsNew.MerchManagerApproved) {
            currentItemUpdate(
              changedControls,
              "Awaiting for Merch Approval",
              "MERCHMGR"
            );
          } else {
            if (
              !reqValues.merchMgrEdit &&
              validateReticket(changedControls, "DC")
            ) {
              const status = marsNew.DCReject
                ? "Rejected by DC"
                : "Approved by DC";
              currentItemUpdate(Req_DcPanel, status, "DC");
            } else {
              setShowLoader(false);
              console.log("Merch manager - No changes.");
            }
          }

          //validateDCpanel();
        } else if (
          ["Awaiting for FC Approval", "Approved"].indexOf(
            marsItem.MARSNextAction
          ) > -1
        ) {
          console.log(
            "Feilds added / updated : ",
            changedControls,
            marsReqValidation
          );
          if (marsItem.MARSNextAction !== "Approved") {
            if (validateReticket(changedControls, "FC")) {
              const status =
                marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
                  ? marsNew.FCRejected
                    ? "Rejected by FC"
                    : "Approved"
                  : "Awaiting for FC Approval";
              currentItemUpdate(changedControls, status, "FC");
            } else {
              const status =
                marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
                  ? marsNew.FCRejected
                    ? "Rejected by FC"
                    : "Approved"
                  : "Awaiting for FC Approval";
              currentItemUpdate(changedControls, status, "FC");
            }
          } else {
            const status =
              marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
                ? marsNew.FCRejected
                  ? "Rejected by FC"
                  : "Approved"
                : "Awaiting for FC Approval";
            currentItemUpdate(changedControls, status, "FC");
          }
        } else {
          setShowLoader(false);
          console.log("Fix the Errors and Submit again.");
        }
      } else if (marsItem.RequestType === "Locator Inquiry") {
        if (reqValues.InitiatorEdit && ValidateLocInq(changedControls)) {
          const reqStatus = "Awaiting for DC Approval";
          currentItemUpdate(changedControls, reqStatus, "MERCH");
          console.log(changedControls, reqStatus);
        } else if (
          [
            "Awaiting for DC Approval",
            "Archived by DC",
            "Rejected by DC",
            "Rejected by FC",
          ].indexOf(marsItem.MARSNextAction) > -1
        ) {
          if (
            !reqValues.InitiatorEdit &&
            validateReticket(changedControls, "DC")
          ) {
            const status = marsNew.DCReject
              ? "Rejected by DC"
              : marsNew.DCApproved
              ? "Awaiting for FC Approval"
              : "Archived by DC";
            currentItemUpdate(Req_DcPanel, status, "DC");
          } else if (reqValues.InitiatorEdit) {
            const status = "Awaiting for DC Approval";
            currentItemUpdate(changedControls, status, "Merch");
          } else {
            setShowLoader(false);
            console.log(" Initiator edit - No changes.");
          }
        } else if (
          ["Awaiting for FC Approval", "Approved"].indexOf(
            marsItem.MARSNextAction
          ) > -1
        ) {
          console.log(
            "Feilds added / updated : ",
            changedControls,
            marsReqValidation
          );
          if (marsItem.MARSNextAction !== "Approved") {
            if (validateReticket(changedControls, "FC")) {
              const status =
                marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
                  ? marsNew.FCRejected
                    ? "Rejected by FC"
                    : "Approved"
                  : "Awaiting for FC Approval";
              currentItemUpdate(changedControls, status, "FC");
            }
          } else {
            const status =
              marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
                ? marsNew.FCRejected
                  ? "Rejected by FC"
                  : "Approved"
                : "Awaiting for FC Approval";
            currentItemUpdate(changedControls, status, "FC");
          }
          // if (validateReticket(changedControls, "FC")) {
          //   const status =
          //     marsNew.FCRejected || marsNew.FCArchived || marsNew.FCApproved
          //       ? marsNew.FCRejected
          //         ? "Rejected by FC"
          //         : "Approved"
          //       : marsItem.MARSNextAction;
          //   currentItemUpdate(changedControls, status, "FC");
          // }
        } else {
          setShowLoader(false);
        }
      }
    } else {
      setShowLoader(false);
      console.log("No Changes Required.");
      window.location.href = document.referrer;
    }
  };

  React.useEffect(() => {
    const url = window.location.href;
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const idValue = searchParams.get("ID");
    let grps: string[] = [];
    const userGrps = getCurrentUserGroups(props.context);
    userGrps
      .then((regrps: string[]) => {
        grps = regrps;
        console.log(`user permission groups - `, regrps);
        const listCols = getListColumns(props.context, "MarsRequests");
        listCols
          .then((result) => {
            updateReqValues({
              DcOptions: result?.DCOptions,
              DcReTicketed: result?.DCPhysicallyReTicketed,
              DistributionCenter: result?.DistributionCenter,
              Division: result?.Division,
              FCOptions: result?.FCOptions,
              MARSDepartment: result?.MARSDepartment,
              MerchLocation: result?.MerchLocation,
              MerchType: result?.MerchType,
              PreTicketed: result?.PreTicketed,
              ReasonForReject: result?.ReasonForReject,
              RequestType: result?.RequestType,
              userDispplayName: props.context.pageContext.user.displayName,
              displayMode: props.displayMode,
            });
          })
          .catch((error) => {
            console.log(` rqApprovers - `, error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    if (idValue !== null) {
      getItem(props.context, parseInt(idValue))
        .then((item: any) => {
          const rqStatus = item?.MARSNextAction;
          const rqReqType = item?.RequestType;
          const apprOne = item?.MerchPrimaryApprover?.EMail;
          const apprTwo = item?.MerchSecondaryApprover?.EMail;
          const email = props.context.pageContext.user.email;
          const rqAuthor = item?.Author?.EMail;
          const reqRoleAccess = getRoleBasedEditControls(
            grps,
            rqStatus,
            rqReqType,
            apprOne,
            apprTwo,
            email,
            rqAuthor
          );
          console.log("End to end role acess - ", reqRoleAccess);
          setEditBtn(reqRoleAccess.editBtnTxt);
          setUserErr(reqRoleAccess.usrErrMsg);
          updateMarsNew({
            Division: item?.Division,
            RequestType: item?.RequestType,
            DistributionCenter: item?.DistributionCenterId,
            MerchLocation: item?.MerchLocation,
            NewMARSDepartment: item?.NewMARSDepartment,
            NewVendor: item?.NewVendor,
            NewVendorName: item?.NewVendorName,
            NewMARSCategory: item?.NewMARSCategory,
            NewNBCStyle: item?.NewNBCStyle,
            NewMerchType: item?.NewMerchType,
            NewCost: item?.NewCost,
            NewCompareAt: item?.NewCompareAt,
            NewRetail: item?.NewRetail,
            NewULine: item?.NewULine,
            MerchManagerSign: item?.MerchManagerSign,
            MerchManagerSignDate: item?.MerchManagerSignDate,
            Retail: item?.Retail,
            dataLoaded: !marsNew.dataLoaded,
            MerchManagerApproved: item?.MerchManagerApproved,
            DCProcessed: item?.DCProcessed,
            DCUnProcessed: item?.DCUnProcessed,
          });
          updateReqValues({
            roleAccess: reqRoleAccess,
            submitToPlanMgr: item?.SubmitToPlanningMgr,
            fcStatus:
              reqRoleAccess.rqFcMgr &&
              ["Awaiting for FC Approval", "Approved"].indexOf(rqStatus) > -1
                ? true
                : false,
          });
          updateMarsItems(item);
          console.log(`Mars Req Item - `, item, reqValues);
        })
        .catch((error) => {
          console.log(`Api error - getItem - `, error);
        });
    }
  }, []);

  return (
    <Stack className={styles.marsForms}>
      {showLoader && (
        <Stack>
          <Overlay id="marsFormOverlayId">
            <Spinner
              id="marsFormSpinnerId"
              style={{ color: "red" }}
              label="Processing..."
              size={SpinnerSize.large}
            />
          </Overlay>
        </Stack>
      )}
      <StackItem>
        <StackItem className={styles.editFormBtns}>
          <PrimaryButton
            text={
              reqValues.toggleExpandCollapse ? "Collapse All" : "Expand All"
            }
            onClick={() =>
              updateReqValues({
                toggleExpandCollapse: !reqValues.toggleExpandCollapse,
              })
            }
            type="primary"
          />
          {editBtn !== "" && (
            <PrimaryButton
              text={editBtn}
              onClick={() => {
                setUserErr("");
                if (editBtn === "Edit as Merch Initiator") {
                  updateReqValues({
                    InitiatorEdit: true,
                    roleAccess: {
                      ...reqValues.roleAccess,
                      disEditBtn: true,
                    },
                  });
                } else if (editBtn === "Edit as Merch Manager") {
                  updateReqValues({
                    merchMgrEdit: true,
                    roleAccess: {
                      ...reqValues.roleAccess,
                      disEditBtn: true,
                    },
                  });
                } else if (editBtn === "Edit as DC Approver") {
                  updateReqValues({
                    dcMgrEdit: true,
                    roleAccess: {
                      ...reqValues.roleAccess,
                      disEditBtn: true,
                    },
                  });
                }
                console.log("Merch Edited - ", marsNew);
              }}
              disabled={reqValues.roleAccess.disEditBtn}
              type="primary"
            />
          )}
        </StackItem>
      </StackItem>
      <StackItem className={styles.errorContainer}>
        {userErr !== "" && !reqValues.isRequestor && (
          <StackItem className={styles.errMessage}>{userErr}</StackItem>
        )}
      </StackItem>
      <StackItem>
        <Acc allowMultipleExpanded={true} allowZeroExpanded={true}>
          <AccordionItem
            dangerouslySetExpanded={reqValues.toggleExpandCollapse}
          >
            <AccordionItemHeading className={styles.sectionHeader}>
              <AccordionItemButton>MARS</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <Stack className={styles.MarsTwoCol}>
                <MarsLabel text="No" required={false} />
                <StackItem>
                  <TextField
                    readOnly
                    disabled={true}
                    value={marsItem ? marsItem.ID : ""}
                  />
                </StackItem>
              </Stack>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem
            dangerouslySetExpanded={reqValues.toggleExpandCollapse}
          >
            <AccordionItemHeading className={styles.sectionHeader}>
              <AccordionItemButton>Product Information</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className={styles.marsInnerPanel}>
              <Stack className={styles.MarsTwoCol}>
                <MarsLabel text={"Division"} required={true} />
                <StackItem>
                  <TextField
                    disabled={true}
                    value={marsItem ? marsItem.Division : ""}
                  />
                </StackItem>
              </Stack>
              <Stack className={styles.MarsTwoCol}>
                <MarsLabel text={"Request Type"} required={true} />
                <StackItem>
                  <TextField
                    disabled={true}
                    value={marsItem ? marsItem.RequestType : ""}
                  />
                </StackItem>
              </Stack>
              <Stack className={styles.MarsTwoCol}>
                <MarsLabel text={"Distribution Center"} required={true} />
                <StackItem>
                  <TextField
                    disabled={true}
                    value={
                      marsItem
                        ? marsItem.DistributionCenter?.map(
                            (dc: any) => dc.Title
                          )
                            ?.toString()
                            ?.replace(/,/g, ", ")
                        : ""
                    }
                  />
                </StackItem>
              </Stack>
              <Stack className={styles.MarsTwoCol}>
                <MarsTooltipLabel text={"Merch Location"} required={true} />
                <StackItem>
                  <TextField
                    disabled={true}
                    value={marsItem ? marsItem.MerchLocation : ""}
                  />
                </StackItem>
              </Stack>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem
            dangerouslySetExpanded={reqValues.toggleExpandCollapse}
          >
            <AccordionItemHeading className={styles.sectionHeader}>
              <AccordionItemButton>Merchandise Information</AccordionItemButton>
            </AccordionItemHeading>
            <OriginalInformation context={props.context} />
          </AccordionItem>
          {marsNew.RequestType === "Reticket Form" && (
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>Merchandise Approval</AccordionItemButton>
              </AccordionItemHeading>
              <MerchandiseApproval context={props.context} />
            </AccordionItem>
          )}
          {!reqValues.InitiatorEdit &&
            !reqValues.merchMgrEdit &&
            marsItem.MARSNextAction !== "Awaiting for Merch Approval" && (
              <>
                <AccordionItem
                  dangerouslySetExpanded={reqValues.toggleExpandCollapse}
                >
                  <AccordionItemHeading className={styles.sectionHeader}>
                    <AccordionItemButton>
                      Distribution Center Information
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <DcInformation context={props.context} />
                </AccordionItem>
                <AccordionItem
                  dangerouslySetExpanded={reqValues.toggleExpandCollapse}
                >
                  <AccordionItemHeading className={styles.sectionHeader}>
                    <AccordionItemButton>
                      Distribution Center Approval / Rejection
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <DcApproval context={props.context} />
                </AccordionItem>
              </>
            )}
          {["Reticket Form", "Locator Inquiry"].indexOf(marsItem.RequestType) >
            -1 &&
            [
              "Awaiting for Merch Approval",
              "Awaiting for DC Approval",
              "Rejected by DC",
              "Rejected by FC",
              "Archived by DC",
            ].indexOf(marsItem.MARSNextAction) < 0 &&
            !reqValues.dcMgrEdit && (
              <>
                <AccordionItem
                  dangerouslySetExpanded={reqValues.toggleExpandCollapse}
                >
                  <AccordionItemHeading className={styles.sectionHeader}>
                    <AccordionItemButton>
                      Financial Control Information
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <FcInformation context={props.context} />
                </AccordionItem>
                <AccordionItem
                  dangerouslySetExpanded={reqValues.toggleExpandCollapse}
                >
                  <AccordionItemHeading className={styles.sectionHeader}>
                    <AccordionItemButton>
                      Financial Control Approval
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <FcApproval context={props.context} />
                </AccordionItem>
              </>
            )}
        </Acc>
        <div style={{ margin: "2%", display: "flex", gap: "2rem" }}>
          <PrimaryButton
            text="Submit"
            onClick={submitHandler}
            disabled={
              (userErr !== "" &&
                marsItem?.MARSNextAction !== "Rejected by FC" &&
                !reqValues.roleAccess.rqRequestor) ||
              reqValues.enableSubmit
            }
          />

          <DefaultButton
            text="Cancel"
            onClick={() => (window.location.href = document.referrer)}
          />
        </div>
      </StackItem>
    </Stack>
  );
};

export default MarsEditForm;
