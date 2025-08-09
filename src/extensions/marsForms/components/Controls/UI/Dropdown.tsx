import * as React from "react";
import {
  Dropdown,
  IDropdownOption,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import styles from "../../MarsForms.module.scss";
import { MarsLabel } from "./Labels";
import { useStore } from "../../../store/useStore";
import { productPanel } from "../../MarsConstants/Constants";
import { giveDisableAndReq } from "../../MarsConstants/ValidationContants";

type IDropdown = {
  options?: any;
  label: string;
  placeholder?: string;
  multiSelect?: boolean;
  defaultSelectedKeys?: string[] | number[];
  required?: boolean;
  value: string | string[];
  name: string;
  layout?: string;
  disable?: boolean;
};

export const MarsSelect = (props: IDropdown): JSX.Element => {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<string>("");

  const {
    updateMarsNew,
    reqValues,
    updateMarsReqValidation,
    updateReqValues,
    marsNew,
    marsItem,
  } = useStore();

  React.useEffect(() => {
    if (reqValues.displayMode !== 8 && reqValues.displayMode !== 0) {
      setSelectedItem(
        props.value !== null && props.value !== undefined
          ? props.value.toString()
          : ""
      );
    }
  }, [reqValues.displayMode]);

  React.useEffect(() => {
    if (props.name === "NewMARSDepartment" || props.name === "NewMerchType") {
      setSelectedItem(
        marsNew[props.name] !== ""
          ? marsNew[props.name]
          : props.name === "NewMARSDepartment"
          ? marsItem.MARSDepartment
          : marsItem.MerchType
      );
    }
  }, [reqValues.reticketCopy]);

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (props.multiSelect) {
      if (item) {
        const newItems = item.selected
          ? [...selectedKeys, item.key as string]
          : selectedKeys.filter((key) => key !== item.key);
        updateMarsNew({
          [props.name]: newItems,
        });
        setSelectedKeys(newItems);
      }
    } else {
      if (item) {
        setSelectedItem(item.key as string);
        updateMarsNew({
          [props.name]: item.key,
        });
      }
    }
    updateMarsReqValidation({
      [props.name]: item ? true : false,
    });

    props.name === "DistributionCenter"
      ? updateReqValues({
          reqControls: [...reqValues.reqControls, props.name],
          dcID: parseInt(item.key as string),
        })
      : updateReqValues({
          reqControls: [...reqValues.reqControls, props.name],
        });
  };

  return (
    <Stack>
      {reqValues.displayMode === 4 ||
      (productPanel.indexOf(props.name) > -1 && reqValues.displayMode === 6) ? (
        <>
          <Stack
            className={props.layout === "twoColumn" ? styles.MarsTwoCol : ""}
          >
            <MarsLabel
              text={props.label}
              required={
                giveDisableAndReq(
                  marsNew.RequestType,
                  props.name,
                  marsNew.Division,
                  marsNew.DCOptions ? marsNew.DCOptions : ""
                ).req
              }
            />
            <StackItem>
              <TextField
                readOnly
                disabled={true}
                value={props.value ? props.value.toString() : ""}
              />
            </StackItem>
          </Stack>
        </>
      ) : props.layout === "twoColumn" ? (
        <>
          <Stack className={styles.MarsTwoCol}>
            <MarsLabel text={props.label} required={props.required} />
            <StackItem>
              <Dropdown
                placeholder={props.placeholder || "Select"}
                options={props.options}
                onChange={onChange}
                multiSelect={props.multiSelect}
                defaultSelectedKeys={props.defaultSelectedKeys}
                disabled={props.disable}
                selectedKeys={selectedKeys}
                selectedKey={selectedItem}
              />
              <p className={styles.errorMessage}>
                {reqValues.submitClk &&
                  (props.multiSelect
                    ? selectedKeys.length === 0
                      ? "Cannot be blank."
                      : ""
                    : selectedItem === ""
                    ? "Cannot be blank."
                    : "")}
              </p>
            </StackItem>
          </Stack>
        </>
      ) : (
        <>
          <StackItem>
            <Dropdown
              label={props.label}
              required={
                props.name === "ReasonForReject"
                  ? marsNew.DCReject
                  : false ||
                    [
                      "MARSDepartment",
                      "MerchType",
                      "NewMARSDepartment",
                      "NewMerchType",
                      "DCOptions",
                    ].indexOf(props.name) > -1
              }
              placeholder={props.placeholder || "Select"}
              options={props.options}
              onChange={onChange}
              multiSelect={props.multiSelect}
              defaultSelectedKeys={props.defaultSelectedKeys}
              disabled={props.disable}
              selectedKeys={selectedKeys}
              selectedKey={selectedItem || props.value}
            />
            <p className={styles.errorMessage}>
              {reqValues.submitClk &&
                (props.multiSelect
                  ? selectedKeys.length === 0
                    ? "Cannot be blank."
                    : ""
                  : (selectedItem === "" || selectedItem === undefined) &&
                    ["FCOptions", "PreTicketed", "ReasonForReject"].indexOf(
                      props.name
                    ) < 0
                  ? "Cannot be blank."
                  : props.name === "ReasonForReject" &&
                    marsNew.DCReject &&
                    (!selectedItem || selectedItem === "Select a reason")
                  ? "Cannot be blank."
                  : "")}
            </p>
          </StackItem>
        </>
      )}
    </Stack>
  );
};
