import * as React from "react";
import { StackItem, TextField } from "@fluentui/react";
//import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "../../MarsForms.module.scss";
import { MarsLabel } from "./Labels";
import { useStore } from "../../../store/useStore";

export interface IMarsPeoplePcikerProps {
  context: any;
  titleText: string;
  personSelectionLimit?: number;
  ensureUser: boolean;
  groupName?: string;
  required?: boolean;
  disabled?: boolean;
  searchTextLimit?: number;
  onChange: (items?: any[]) => void;
  valid?: boolean;
  defaultSelectedUsers?: string[];
  webAbsoluteUrl?: string;
  label: string;
}

export const MarsPeoplePicker = ({
  context,
  titleText,
  personSelectionLimit,
  webAbsoluteUrl,
  ensureUser,
  groupName,
  required,
  disabled,
  searchTextLimit,
  onChange,
  defaultSelectedUsers,
  label,
}: IMarsPeoplePcikerProps): JSX.Element => {
  const { reqValues } = useStore();
  return (
    <>
      {reqValues.displayMode === 4 ? (
        <>
          <StackItem>
            <MarsLabel text={label} required={required} />
            <TextField
              readOnly
              disabled={true}
              value={
                defaultSelectedUsers ? defaultSelectedUsers.toString() : ""
              }
            />
          </StackItem>
        </>
      ) : (
        <StackItem className={styles.peopleControl}>
          <MarsLabel text={label} required={true} />
          <PeoplePicker
            context={context}
            titleText={titleText}
            personSelectionLimit={personSelectionLimit}
            webAbsoluteUrl={webAbsoluteUrl}
            ensureUser={ensureUser}
            groupName={groupName}
            required={required}
            disabled={disabled}
            searchTextLimit={searchTextLimit}
            onChange={onChange}
            showHiddenInUI={true}
            principalTypes={[PrincipalType.User]}
            defaultSelectedUsers={defaultSelectedUsers}
          />
        </StackItem>
      )}
    </>
  );
};
