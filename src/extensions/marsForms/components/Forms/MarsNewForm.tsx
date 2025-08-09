import * as React from "react";
import { IMarsAllFeilds, IMarsForm, IMarsNew } from "../Interfaces/IMarsForm";
import {
  PrimaryButton,
  Stack,
  StackItem,
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
import { MarsChoice } from "../Controls/UI/ChoiceGroup";
import { MarsSelect } from "../Controls/UI/Dropdown";
import OriginalInformation from "../Controls/Panels/OriginalInformation";
import MerchandiseApproval from "../Controls/Panels/MerchandiseApproval";
// import { DcApproval, DcInformation } from "../Controls/Panels/DcInformation";
// import { FcApproval, FcInformation } from "../Controls/Panels/FcInformation";
import {
  addItem,
  getListColumns,
  getCurrentUserGroups,
} from "../services/services";
import { useStore } from "../../store/useStore";
//import { ReTicket_Type } from "../MarsConstants/ValidationContants";
import * as moment from "moment";
import { ReTicket_Req } from "../MarsConstants/MerchConstants";
import { MARS_Initiators } from "../MarsConstants/ValidationContants";
import { LocInquiry_Req } from "../MarsConstants/Constants";

const MarsNewForm = (props: IMarsForm): JSX.Element => {
  const { marsNew, reqValues, updateReqValues, marsReqValidation } = useStore();
  const [showLoader, setShowLoader] = React.useState<boolean>(false);
  const [userErr, setUserErr] = React.useState<string>("");
  //const [toggleExpandCollapse, setToggleExpandCollapse] = React.useState(true);

  const validateReticket = (): IMarsNew | null => {
    let erroredFeilds = "";
    const newItem: any = {};
    if (
      marsNew.MarsStyleChange &&
      marsNew.NewNBCStyle !== "" &&
      marsNew.NewNBCStyle === marsNew.NBCStyle
    ) {
      return null;
    }
    ReTicket_Req.forEach((feild) => {
      if (!marsReqValidation[feild as keyof IMarsAllFeilds]) {
        erroredFeilds += feild + ", ";
      }
      if (feild !== "DistributionCenter") {
        newItem[feild] = marsNew[feild as keyof IMarsNew];
      }
      if (feild === "UpdatedPC") {
        newItem[feild] = marsNew[feild as keyof IMarsNew] ? true : false;
      }
      if (feild === "MerchSignDate") {
        newItem[feild] = moment(marsNew.MerchSignDate);
      }
    });
    console.log("test 3 - ", erroredFeilds);
    if (erroredFeilds !== "") {
      return null;
    } else {
      newItem.Page = marsNew.Page;
      newItem.Line = marsNew.Line;
      newItem.VendorName = marsNew.VendorName;
      newItem.MARSCategory = marsNew.MARSCategory;
      newItem.NewVendorName = marsNew.NewVendorName;
      newItem.NewMARSCategory = marsNew.NewMARSCategory;
      newItem.PreTicketed = marsNew.PreTicketed;
      newItem.ControlFiles = marsNew.ControlFiles;
      newItem.MarsStyleChange = marsNew.MarsStyleChange;
      newItem.SpecialInstructions = marsNew.SpecialInstructions;
      newItem.MerchPrimaryApproverTitle = marsNew.MerchPrimaryApproverTitle;
      newItem.MerchSecondaryApproverTitle = marsNew.MerchSecondaryApproverTitle;
      newItem.MARSNextAction = "Awaiting for Merch Approval";
      if (marsNew.Division === "Marshalls") {
        newItem.ULine = marsNew.ULine;
        newItem.NewULine = marsNew.NewULine;
      }
      return newItem;
    }
  };

  const ValidateLocInq = () => {
    let erroredFeilds = "";
    const newItem: any = {};
    LocInquiry_Req.forEach((feild) => {
      if (!marsReqValidation[feild as keyof IMarsAllFeilds]) {
        erroredFeilds += feild + ", ";
      }
      if (feild !== "DistributionCenter") {
        newItem[feild] = marsNew[feild as keyof IMarsNew];
      }
    });
    console.log("test 3 - ", erroredFeilds);
    if (erroredFeilds !== "") {
      return null;
    } else {
      newItem.UnitsPerPlanning = marsNew.UnitsPerPlanning;
      newItem.MARSCategory = marsNew.MARSCategory;
      newItem.ControlFiles = marsNew.ControlFiles;
      console.log(
        `Loc Inq item - `,
        newItem,
        marsNew.DistributionCenter,
        marsNew.DistributionCenterId
      );
      return newItem;
    }
  };

  const submitHandler = (): void => {
    setShowLoader(true);
    updateReqValues({
      submitClk: true,
    });
    if (
      marsNew.DistributionCenter.length === 0 ||
      !marsNew.Division ||
      !marsNew.RequestType ||
      !marsNew.MerchLocation
    ) {
      setShowLoader(false);
      console.log("Fill the required feilds.");
      return;
    }
    const Item =
      marsNew.RequestType === "Reticket Form"
        ? validateReticket()
        : ValidateLocInq();
    if (Item !== null) {
      Item.MarsHistory = JSON.stringify([
        {
          RevisiedBy: reqValues.userDispplayName,
          DateTime:
            new Date().toDateString() + " " + new Date().toLocaleTimeString(),
          Change:
            marsNew.RequestType === "Reticket Form"
              ? "Awaiting for Merch Approval"
              : "Awaiting for DC Approval",
        },
      ]);
      Item.MarsUniqueID =
        Date.now().toString() +
        reqValues.userDispplayName
          ?.split(" ")
          ?.map((word) => word.charAt(0))
          ?.join("")
          ?.toUpperCase();
      let validateRTV = false;
      if (
        marsNew.RequestType !== "Locator Inquiry" &&
        marsNew.RequestType !== "Samples"
      ) {
        if (
          marsNew.RequestType === "RTV" &&
          marsNew.DistributionCenter.length > 1
        ) {
          validateRTV = false;
          marsNew.DistributionCenter.forEach((dc, ind) => {
            Item.DistributionCenterId = [parseInt(dc)];
            addItem(props.context, Item)
              .then((result) => {
                setShowLoader(false);
                console.log(`New Item added - `, result, ind);
                window.location.href = document.referrer;
              })
              .catch((error) => {
                setShowLoader(false);
                console.log(`Something went wrong in creating item - `, error);
              });
          });
        } else {
          Item.DistributionCenterId = marsNew.DistributionCenter.map(Number);
          Item.MARSNextAction =
            marsNew.RequestType === "Reticket Form"
              ? "Awaiting for Merch Approval"
              : "Awaiting for DC Approval";
          validateRTV = true;
        }
      } else {
        // if (
        //   marsNew.RequestType === "Samples" ||
        //   marsNew.RequestType === "Locator Inquiry"
        // ) {

        // }
        Item.DistributionCenterId = [reqValues.dcID];
        Item.MARSNextAction = "Awaiting for DC Approval";
        validateRTV = true;
      }
      if (validateRTV) {
        console.log(`New Item to be added - `, Item);
        addItem(props.context, Item)
          .then((result) => {
            setShowLoader(false);
            console.log(`New Item added - `, result);
            window.location.href = document.referrer;
          })
          .catch((error) => {
            setShowLoader(false);
            console.log(`Something went wrong in creating item - `, error);
          });
      }
    } else {
      setShowLoader(false);
    }
    console.log("test 4 - ", Item);
  };

  React.useEffect(() => {
    const userGrps = getCurrentUserGroups(props.context);
    userGrps
      .then((grps: string[]) => {
        console.log(`depending user grps - `, grps);
        let rqAccess: boolean = false;
        MARS_Initiators.forEach((group) => {
          if (grps.indexOf(group) > -1) {
            rqAccess = true;
          }
        });
        if (!rqAccess) {
          setUserErr(
            "You need to be in Merchandising Initiator group to be able to create new reuests."
          );
        }
        const listCols = getListColumns(props.context, "MarsRequests");
        listCols
          .then((result) => {
            updateReqValues({
              DcOptions: result?.DCOptions,
              DcReTicketed: result?.DCPhysicallyReTicketed,
              DistributionCenter: result?.DistributionCenter?.sort(
                (a: any, b: any) => a.order - b.order
              ),
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
              userGroups: grps,
              isRequestor: rqAccess,
            });
          })
          .catch((error) => {
            console.log(` rqApprovers - `, error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
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
        <StackItem className={""}>
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
              <AccordionItemButton>Product Information</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className={styles.marsInnerPanel}>
              <MarsChoice
                label="Division"
                value={marsNew.Division.toString()}
                options={reqValues.Division}
                name="Division"
                required={true}
                disable={!reqValues.isRequestor}
              />
              <MarsSelect
                layout={"twoColumn"}
                label="Request Type"
                multiSelect={false}
                required={true}
                name={"RequestType"}
                value={marsNew.RequestType.toString()}
                options={reqValues.RequestType}
                disable={!reqValues.isRequestor}
              />
              <MarsSelect
                layout={"twoColumn"}
                label="Distribution Center"
                multiSelect={
                  marsNew.RequestType === "Reticket Form" ? true : false
                }
                required={true}
                name={"DistributionCenter"}
                value={marsNew.DistributionCenter.toString()}
                options={
                  marsNew.Division !== ""
                    ? reqValues.DistributionCenter?.filter(
                        (dc) => dc.dependentVal === marsNew.Division
                      )
                    : reqValues.DistributionCenter || []
                }
                disable={marsNew.Division !== "" ? false : true}
              />
              <MarsChoice
                label="Merch Location"
                value={marsNew.MerchLocation.toString()}
                name="MerchLocation"
                required={true}
                options={reqValues.MerchLocation?.map((opt) =>
                  marsNew.RequestType === "Locator Inquiry"
                    ? opt.key !== "Lanes"
                      ? { ...opt, disabled: false }
                      : opt
                    : marsNew.RequestType === "Reticket Form"
                    ? { ...opt, disabled: false }
                    : opt
                )}
                disable={!reqValues.isRequestor}
              />
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
        </Acc>
        <div style={{ margin: "2%", display: "flex", gap: "2rem" }}>
          <PrimaryButton
            text="Submit"
            onClick={submitHandler}
            disabled={reqValues.enableSubmit || !reqValues.isRequestor}
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

export default MarsNewForm;
