import { AccordionItemPanel } from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import * as React from "react";
import styles from "../../MarsForms.module.scss";
import { PrimaryButton, Stack, StackItem } from "@fluentui/react";
import { MarsTextBox } from "../UI/TextBox";
import {
  NewInformation,
  OriginalInfo,
} from "../../MarsConstants/MerchConstants";
import { IOrgInfo } from "../../Interfaces/IMarsForm";
import { MarsSelect } from "../UI/Dropdown";
import MarsCheckBox from "../UI/CheckBox";
import { MarsLabel } from "../UI/Labels";
import { useStore } from "../../../store/useStore";

const OriginalInformation = (props: IOrgInfo): JSX.Element => {
  const {
    reqValues,
    marsNew,
    updateMarsNew,
    updateMarsReqValidation,
    marsItem,
    updateReqValues,
  } = useStore();

  const validateControl = (control: string): boolean => {
    return reqValues.reqControls.indexOf(control) > -1 ? true : false;
  };

  const handleMerchUpdate = (): void => {
    updateMarsNew({
      NewMARSDepartment: validateControl("MARSDepartment")
        ? marsNew.MARSDepartment
        : marsItem.MARSDepartment,
      NewVendor: validateControl("Vendor") ? marsNew.Vendor : marsItem.Vendor,
      NewVendorName: validateControl("VendorName")
        ? marsNew.VendorName
        : marsItem.VendorName,
      NewMARSCategory: validateControl("MARSCategory")
        ? marsNew.MARSCategory
        : marsItem.MARSCategory,
      NewNBCStyle: validateControl("NBCStyle")
        ? marsNew.NBCStyle
        : marsItem.NBCStyle,
      NewMerchType: validateControl("MerchType")
        ? marsNew.MerchType
        : marsItem.MerchType,
      NewCost: validateControl("Cost") ? marsNew.Cost : marsItem.Cost,
      NewCompareAt: validateControl("CompareAt")
        ? marsNew.CompareAt
        : marsItem.CompareAt,
      NewRetail: validateControl("Retail") ? marsNew.Retail : marsItem.Retail,
      NewULine: validateControl("ULine") ? marsNew.ULine : marsItem.ULine,
    });
    updateMarsReqValidation({
      NewMARSDepartment: true,
      NewVendor: true,
      NewVendorName: true,
      NewMARSCategory: true,
      NewNBCStyle: true,
      NewMerchType: true,
      NewCost: true,
      NewCompareAt: true,
      NewRetail: true,
      NewULine: true,
    });
    updateReqValues({
      reticketCopy: !reqValues.reticketCopy,
      reqControls: [
        ...reqValues.reqControls,
        "NewMARSDepartment",
        "NewVendor",
        "NewVendorName",
        "NewMARSCategory",
        "NewNBCStyle",
        "NewMerchType",
        "NewCost",
        "NewCompareAt",
        "NewRetail",
        "NewULine",
      ],
      newNbcError: {
        ...reqValues.newNbcError,
        styleChange: marsNew.MarsStyleChange
          ? marsNew.MarsStyleChange
          : marsItem.MarsStyleChange,
        nbcStyle:
          marsNew.NBCStyle !== "" ? marsNew.NBCStyle : marsItem.NBCStyle,
        newNbcStyle:
          marsNew.NBCStyle !== "" ? marsNew.NBCStyle : marsItem.NBCStyle,
      },
    });
    console.log(
      "merch copy clicked. - ",
      reqValues.reqControls,
      marsNew,
      reqValues
    );
  };
  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.internalPanel}>
        <StackItem className={styles.internalHeader}>
          Original Information
        </StackItem>
        <StackItem className={styles.originalInformation}>
          {OriginalInfo.map((Info, index) => {
            if (Info.type === "text" || Info.type === "number") {
              return (
                <MarsTextBox
                  label={Info.label}
                  required={false}
                  name={Info.name}
                  type={Info.type}
                  val={reqValues.displayMode !== 8 ? marsItem[Info.name] : ""}
                  validation={Info.reqValid || false}
                  MaxLen={Info.MaxLen || 256}
                  placeholder={Info.placeholder}
                  disable={
                    !reqValues.InitiatorEdit &&
                    !reqValues.fcStatus &&
                    reqValues.displayMode !== 8
                  }
                />
              );
            } else if (Info.type === "select") {
              return (
                <MarsSelect
                  layout={"oneColumn"}
                  options={
                    Info.options === "MARSDepartment"
                      ? reqValues.MARSDepartment
                      : Info.options === "MerchType"
                      ? reqValues.MerchType
                      : reqValues.PreTicketed
                  }
                  label={Info.label}
                  multiSelect={false}
                  required={true}
                  name={Info.name}
                  value={reqValues.displayMode !== 8 ? marsItem[Info.name] : ""}
                  disable={
                    marsNew.RequestType === "Reticket Form"
                      ? !reqValues.InitiatorEdit &&
                        !reqValues.fcStatus &&
                        reqValues.displayMode !== 8
                      : reqValues.displayMode !== 8
                      ? Info.name === "PreTicketed" ||
                        (!reqValues.InitiatorEdit && !reqValues.fcStatus)
                      : Info.name === "PreTicketed" || false
                  }
                />
              );
            } else if (Info.type === "checkbox") {
              return (
                <MarsCheckBox
                  label={Info.label}
                  name={Info.name}
                  isChecked={
                    reqValues.displayMode !== 8 ? !!marsItem[Info.name] : false
                  }
                  required={
                    marsNew.RequestType === "Reticket Form" &&
                    Info.name !== "MarsStyleChange"
                      ? true
                      : false
                  }
                  disable={
                    marsNew.RequestType === "Reticket Form"
                      ? !reqValues.InitiatorEdit &&
                        !reqValues.fcStatus &&
                        reqValues.displayMode !== 8
                      : reqValues.displayMode !== 8
                      ? Info.name === "MarsStyleChange" ||
                        !reqValues.InitiatorEdit
                      : Info.name === "MarsStyleChange"
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
        <StackItem className={styles.originalInfo}>
          <MarsTextBox
            label={"Style Description"}
            required={false}
            name={"MARSDescription"}
            type={"text"}
            val={reqValues.displayMode !== 8 ? marsItem.MARSDescription : ""}
            multiline={true}
            MaxLen={65000}
            disable={
              !reqValues.InitiatorEdit &&
              !reqValues.fcStatus &&
              reqValues.displayMode !== 8
            }
          />
          <MarsTextBox
            label={"Planning Instructions"}
            required={false}
            name={"SpecialInstructions"}
            type={"text"}
            val={
              reqValues.displayMode !== 8 ? marsItem.SpecialInstructions : ""
            }
            multiline={true}
            MaxLen={65000}
            disable={
              !reqValues.InitiatorEdit &&
              !reqValues.fcStatus &&
              reqValues.displayMode !== 8
            }
          />
        </StackItem>
      </Stack>
      {(marsNew.RequestType === "Reticket Form" ||
        marsItem.RequestType === "Reticket Form") && (
        <Stack className={styles.internalPanel}>
          <StackItem className={styles.internalHeader}>
            New Information
          </StackItem>
          {(reqValues.displayMode === 8 || reqValues.InitiatorEdit) && (
            <StackItem className={styles.newInformation}>
              <MarsLabel text="Click Update buttton to update with Original Information" />
              <PrimaryButton text="Update" onClick={handleMerchUpdate} />
            </StackItem>
          )}

          <StackItem className={styles.originalInformation}>
            {NewInformation.map((Info, index) => {
              if (Info.type === "text" || Info.type === "number") {
                return (
                  <MarsTextBox
                    label={Info.label}
                    required={false}
                    name={Info.name}
                    type={Info.type}
                    val={reqValues.displayMode !== 8 ? marsItem[Info.name] : ""}
                    MaxLen={Info.MaxLen || 256}
                    placeholder={Info.placeholder}
                    validation={Info.reqValid || false}
                    disable={
                      !reqValues.InitiatorEdit &&
                      !reqValues.fcStatus &&
                      reqValues.displayMode !== 8
                    }
                  />
                );
              } else if (Info.type === "select") {
                return (
                  <MarsSelect
                    layout={"oneColumn"}
                    options={
                      Info.options === "MARSDepartment"
                        ? reqValues.MARSDepartment
                        : reqValues.MerchType
                    }
                    label={Info.label}
                    multiSelect={false}
                    required={true}
                    name={Info.name}
                    value={
                      reqValues.displayMode !== 8 ? marsItem[Info.name] : ""
                    }
                    disable={
                      !reqValues.InitiatorEdit &&
                      !reqValues.fcStatus &&
                      reqValues.displayMode !== 8
                    }
                  />
                );
              }
            })}
          </StackItem>
        </Stack>
      )}
    </AccordionItemPanel>
  );
};

export default OriginalInformation;
