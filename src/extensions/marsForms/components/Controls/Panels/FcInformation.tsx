import * as React from "react";
import { AccordionItemPanel } from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import { IMarsNew, IOrgInfo } from "../../Interfaces/IMarsForm";
import { Stack, StackItem } from "@fluentui/react";
import MarsCheckBox from "../UI/CheckBox";
import { MarsTextBox } from "../UI/TextBox";
import styles from "../../MarsForms.module.scss";
import {
  FcNewOriginalInfo,
  FcOriginalInfo,
} from "../../MarsConstants/FcConstants";
import { MarsSelect } from "../UI/Dropdown";
import { useStore } from "../../../store/useStore";
import * as moment from "moment";
import { FcVConstants } from "../../MarsConstants/ValidationContants";

export const FcInformation = (props: IOrgInfo): JSX.Element => {
  const {
    reqValues,
    marsNew,
    updateMarsNew,
    marsItem,
    updateMarsReqValidation,
  } = useStore();
  React.useEffect(() => {
    updateMarsNew({
      PONumber: marsItem?.PONumber,
      UnitsPerPlanning: marsItem?.UnitsPerPlanning,
      LadderPlan: marsItem?.LadderPlan,
      Page: marsItem?.Page,
      Line: marsItem?.Line,
      MARSDepartment: marsItem?.MARSDepartment,
      Vendor: marsItem?.Vendor,
      VendorName: marsItem?.VendorName,
      MARSCategory: marsItem?.MARSCategory,
      NBCStyle: marsItem?.NBCStyle,
      MerchType: marsItem?.MerchType,
      Cost: marsItem?.Cost,
      CompareAt: marsItem?.CompareAt,
      Retail: marsItem?.Retail,
      ULine: marsItem?.ULine,
      PreTicketed: marsItem?.PreTicketed,
      ControlFiles: marsItem?.ControlFiles,
      MarsStyleChange: marsItem?.MarsStyleChange,
      MARSDescription: marsItem?.MARSDescription,
      SpecialInstructions: marsItem?.SpecialInstructions,
      NewVendor: marsItem?.NewVendor,
      NewNBCStyle: marsItem?.NewNBCStyle,
      NewVendorName: marsItem?.NewVendorName,
      NewMARSCategory: marsItem?.NewMARSCategory,
      NewULine: marsItem?.NewULine,
      NewCost: marsItem?.NewCost,
      NewRetail: marsItem?.NewRetail,
      NewCompareAt: marsItem?.NewCompareAt,
      NewMARSDepartment: marsItem?.NewMARSDepartment,
      NewMerchType: marsItem?.NewMerchType,
      DCUnitsActedOn: marsItem?.DCUnitsActedOn,
      DCWorkCompletedById: marsItem?.DCWorkCompletedById,
      DCApproverEmail: marsItem?.DCApproverEmail,
      DCOptions: marsItem?.DCOptions,
      OverAllRetailImpact: marsItem?.OverAllRetailImpact,
      DCOptionComments: marsItem?.DCOptionComments,
      PrintMARS: marsItem?.PrintMARS !== null ? marsItem?.PrintMARS : false,
      FCTRX: marsItem?.FCTRX,
      FCCode: marsItem?.FCCode,
      FCNewTRX: marsItem?.FCNewTRX,
      FCNewCode: marsItem?.FCNewCode,
      FCSpecialInstructions: marsItem?.FCSpecialInstructions,
      FCDataEntryQuantity: marsItem?.FCDataEntryQuantity,
      FCOptions: marsItem?.FCOptions,
      FCApproved: marsItem?.FCApproved,
      FCArchived: marsItem?.FCArchived,
      FCRejected: marsItem?.FCRejected,
      FCComments: marsItem?.FCComments,
      FCSign: marsItem?.FCSign,
      FCSignDate: marsItem?.FCSignDate,
    });
    updateMarsReqValidation(FcVConstants);
  }, [marsItem]);
  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.internalPanel}>
        <StackItem className={styles.internalHeader}>
          Original Information
        </StackItem>
        <StackItem className={styles.originalInformation}>
          {FcOriginalInfo.map((Info, index) => {
            if (Info.type === "text" || Info.type === "number") {
              return (
                <MarsTextBox
                  label={Info.label}
                  required={false}
                  name={Info.name}
                  type={Info.type}
                  val={
                    marsNew[Info.name as keyof IMarsNew]?.toString() ||
                    marsItem[Info.name as keyof IMarsNew]
                  }
                  MaxLen={Info.MaxLen || 256}
                  disable={
                    ["FCTRX", "FCCode"].indexOf(Info.name) < 0 ||
                    !reqValues.fcStatus
                  }
                />
              );
            } else {
              return <StackItem>&nbsp;</StackItem>;
            }
          })}
        </StackItem>
        <StackItem className={styles.dcApproverComments}>
          <Stack>
            <MarsTextBox
              label={"Style Description"}
              required={true}
              name={"MARSDescription"}
              type={"text"}
              val={marsItem.MARSDescription}
              multiline={true}
              MaxLen={65000}
              disable={true}
            />
          </Stack>
          <Stack>
            {marsItem.RequestType === "Locator Inquiry" && (
              <Stack>
                <StackItem>
                  <hr className={styles.horizontalLine} />
                </StackItem>
                <StackItem className={styles.fcOrgInfo}>
                  <MarsTextBox
                    label={"FC Notes"}
                    required={true}
                    name={"FCSpecialInstructions"}
                    type={"text"}
                    val={marsNew.FCSpecialInstructions}
                    multiline={true}
                    MaxLen={65000}
                    disable={!reqValues.fcStatus}
                  />
                </StackItem>
                <StackItem className={styles.fcOrgInfo}>
                  <MarsTextBox
                    label={"Data Entry Quantity"}
                    required={true}
                    name={"FCDataEntryQuantity"}
                    type={"text"}
                    val={marsNew.FCDataEntryQuantity}
                    multiline={false}
                    MaxLen={256}
                    disable={!reqValues.fcStatus}
                  />
                </StackItem>
                <StackItem className={styles.fcOrgInfo}>
                  <MarsSelect
                    layout={"oneColumn"}
                    options={reqValues.FCOptions}
                    label={"FC Options"}
                    multiSelect={false}
                    required={true}
                    name={"FCOptions"}
                    value={marsNew.FCOptions || ""}
                    disable={!reqValues.fcStatus}
                  />
                </StackItem>
              </Stack>
            )}
          </Stack>
        </StackItem>
      </Stack>
      {(marsItem.RequestType === "Reticket Form" ||
        marsItem.RequestType === "Reticket Form") && (
        <Stack className={styles.internalPanel}>
          <StackItem className={styles.internalHeader}>
            New Information
          </StackItem>
          <StackItem className={styles.originalInformation}>
            {FcNewOriginalInfo.map((Info, index) => {
              if (Info.type === "text" || Info.type === "number") {
                return (
                  <MarsTextBox
                    label={Info.label}
                    required={false}
                    name={Info.name}
                    type={Info.type}
                    val={
                      marsNew[Info.name as keyof IMarsNew]?.toString() ||
                      marsItem[Info.name as keyof IMarsNew]
                    }
                    MaxLen={Info.MaxLen || 256}
                    disable={
                      ["FCNewTRX", "FCNewCode"].indexOf(Info.name) < 0 ||
                      !reqValues.fcStatus
                    }
                  />
                );
              } else {
                return <StackItem>&nbsp;</StackItem>;
              }
            })}
          </StackItem>
          <StackItem>
            <hr className={styles.horizontalLine} />
          </StackItem>
          <StackItem className={styles.fcOrgInfo}>
            <MarsTextBox
              label={"FC Notes"}
              required={true}
              name={"FCSpecialInstructions"}
              type={"text"}
              val={marsNew.FCSpecialInstructions}
              multiline={true}
              MaxLen={65000}
              disable={!reqValues.fcStatus}
            />
          </StackItem>
          <StackItem className={styles.fcOrgInfo}>
            <MarsTextBox
              label={"Data Entry Quantity"}
              required={true}
              name={"FCDataEntryQuantity"}
              type={"text"}
              val={marsNew.FCDataEntryQuantity}
              multiline={false}
              MaxLen={256}
              disable={!reqValues.fcStatus}
            />
          </StackItem>
          <StackItem className={styles.fcOrgInfo}>
            <MarsSelect
              layout={"oneColumn"}
              options={reqValues.FCOptions}
              label={"FC Options"}
              multiSelect={false}
              required={true}
              name={"FCOptions"}
              value={marsNew.FCOptions || ""}
              disable={!reqValues.fcStatus}
            />
          </StackItem>
        </Stack>
      )}
    </AccordionItemPanel>
  );
};

export const FcApproval = (props: IOrgInfo): JSX.Element => {
  const { marsNew, reqValues } = useStore();
  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.dcApproval}>
        <StackItem>
          <MarsCheckBox
            label={"Approve with note to DC"}
            name={"FCApproved"}
            isChecked={marsNew.FCApproved ? marsNew.FCApproved : false}
            required={false}
            disable={
              marsNew.FCArchived || marsNew.FCRejected || !reqValues.fcStatus
            }
          />
        </StackItem>
        <StackItem>
          <MarsCheckBox
            label={"Approve with note to Merchandising"}
            name={"FCArchived"}
            isChecked={marsNew.FCArchived ? marsNew.FCArchived : false}
            required={false}
            disable={
              marsNew.FCApproved || marsNew.FCRejected || !reqValues.fcStatus
            }
          />
        </StackItem>
        <StackItem>
          <MarsCheckBox
            label={"Reject to DC"}
            name={"FCRejected"}
            isChecked={marsNew.FCRejected ? marsNew.FCRejected : false}
            required={false}
            disable={
              marsNew.FCApproved || marsNew.FCArchived || !reqValues.fcStatus
            }
          />
        </StackItem>
        <StackItem>&nbsp;</StackItem>
      </Stack>
      <Stack className={styles.dcApproverComments}>
        <StackItem>
          <MarsTextBox
            label={"Approver Comments"}
            required={true}
            name={"FCComments"}
            type={"text"}
            val={marsNew.FCComments}
            multiline={true}
            MaxLen={65000}
            disable={!reqValues.fcStatus}
          />
        </StackItem>
      </Stack>
      <Stack className={styles.dcApproval}>
        <StackItem>
          <MarsTextBox
            label={"Electronic Signature"}
            required={true}
            name={"FCSign"}
            type={"text"}
            val={marsNew.FCSign}
            MaxLen={256}
            disable={!reqValues.fcStatus}
          />
        </StackItem>
        <StackItem>
          <MarsTextBox
            label={"Date"}
            required={true}
            name={"FCSignDate"}
            type={"text"}
            val={
              marsNew.FCSignDate
                ? moment(marsNew.FCSignDate).format("MM/DD/YYYY")
                : ""
            }
            MaxLen={256}
            disable={!reqValues.fcStatus}
          />
        </StackItem>
      </Stack>
    </AccordionItemPanel>
  );
};
