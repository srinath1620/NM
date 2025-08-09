import * as React from "react";
import {
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import styles from "../../MarsForms.module.scss";
import { Stack, StackItem, TextField } from "@fluentui/react";
import { MarsLabel, MarsTooltipLabel } from "./Labels";
import { useStore } from "../../../store/useStore";
import { productPanel } from "../../MarsConstants/Constants";

type IMarsChoice = {
  label: string;
  required: boolean;
  options?: IChoiceGroupOption[];
  value: string;
  name: string;
  type?: string;
  disable?: boolean;
};

export const MarsChoice = (props: IMarsChoice): JSX.Element => {
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const {
    updateMarsNew,
    reqValues,
    updateReqValues,
    updateMarsReqValidation,
    marsNew,
  } = useStore();
  const _onChange = (
    ev: React.FormEvent<HTMLInputElement>,
    option: IChoiceGroupOption
  ): void => {
    //props.handler(props.name, option.key);
    setSelectedItem(option.key);
    updateMarsNew({
      [props.name]: option?.key,
    });

    if (props.name === "UpdatedPC") {
      updateReqValues({
        enableSubmit: option?.key === "No" ? true : false,
      });
    }

    updateMarsReqValidation({
      [props.name]: option ? true : false,
    });

    updateReqValues({
      reqControls: [...reqValues.reqControls, props.name],
    });
  };

  React.useEffect(() => {
    if (reqValues.displayMode !== 8 && reqValues.displayMode !== 0) {
      setSelectedItem(props.value);
    }
  }, [reqValues.displayMode]);

  return (
    <>
      {reqValues.displayMode === 4 ||
      (productPanel.indexOf(props.name) > -1 && reqValues.displayMode === 6) ? (
        <>
          <Stack
            className={
              props.type !== "merchpanel" ? styles.MarsTwoCol : "merchSingleCol"
            }
          >
            <MarsLabel text={props.label} required={props.required} />
            <StackItem>
              <TextField readOnly disabled={true} value={props.value} />
            </StackItem>
          </Stack>
        </>
      ) : props.type !== "merchpanel" ? (
        <Stack className={styles.MarsTwoCol}>
          {props.name !== "MerchLocation" ? (
            <MarsLabel text={props.label} required={props.required} />
          ) : (
            <MarsTooltipLabel text={props.label} required={props.required} />
          )}

          <StackItem>
            <ChoiceGroup
              defaultSelectedKey={props.value}
              //selectedKey={props.value}
              options={props.options}
              onChange={_onChange}
              name={props.name}
              disabled={props.disable}
            />
            <p className={styles.errorMessage}>
              {reqValues.submitClk && selectedItem === ""
                ? "Cannot be blank."
                : ""}
            </p>
          </StackItem>
        </Stack>
      ) : (
        <Stack className="merchSingleCol">
          <StackItem>
            <ChoiceGroup
              label={props.label}
              required={props.required}
              defaultSelectedKey={props.value}
              selectedKey={selectedItem || props.value}
              options={props.options}
              onChange={_onChange}
              name={props.name}
              className={styles.merchRadio}
              disabled={props.disable}
            />
            <p className={styles.errorMessage}>
              {reqValues.submitClk &&
              selectedItem === "" &&
              marsNew.RequestType === "Reticket Form" &&
              props.name === "UpdatedPC"
                ? "Cannot be blank."
                : props.name === "UpdatedPC" && selectedItem === "No"
                ? "PC10 must be updated prior to submission."
                : ""}
            </p>
          </StackItem>
        </Stack>
      )}
    </>
  );
};
