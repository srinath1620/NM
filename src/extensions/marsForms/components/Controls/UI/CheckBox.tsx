import { Checkbox, StackItem } from "@fluentui/react";
import * as React from "react";
import styles from "../../MarsForms.module.scss";
import { MarsLabel } from "./Labels";
import { useStore } from "../../../store/useStore";
import * as moment from "moment";
import { ReqCheckBox_NonReq } from "../../MarsConstants/Constants";
import { ReTicket_Req } from "../../MarsConstants/MerchConstants";

type ICheckBox = {
  isChecked: boolean;
  label: string;
  name: string;
  required: boolean;
  disable?: boolean;
};

const MarsCheckBox = (props: ICheckBox): JSX.Element => {
  const {
    updateMarsNew,
    reqValues,
    updateMarsReqValidation,
    updateReqValues,
    marsNew,
    marsItem,
  } = useStore();
  const [reqChecked, setReqChecked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (reqValues.displayMode !== 8 && reqValues.displayMode !== 0) {
      setReqChecked(props.isChecked || false);
    }
  }, [reqValues.displayMode]);

  React.useEffect(() => {
    if (marsNew.MarsStyleChange && marsNew.NBCStyle !== "") {
      updateReqValues({
        newNbcError: {
          ...reqValues.newNbcError,
          errMsg: "Both NbcStyle and NewNbcStyle cannot be same.",
        },
      });
    } else {
      updateReqValues({
        newNbcError: {
          ...reqValues.newNbcError,
          errMsg: "",
        },
      });
    }
  }, [marsNew.NBCStyle, marsNew.NewNBCStyle, reqValues.reticketCopy]);

  const _onChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ): void => {
    //props.handler(props.name, option.key);
    setReqChecked(!!checked);

    if (
      ["SubmitToPlanningMgr", "MerchManagerApproved"].indexOf(props.name) > -1
    ) {
      const chngCntrls =
        props.name !== "MerchManagerApproved"
          ? [...reqValues.reqControls, "MerchSign", "MerchSignDate", props.name]
          : [
              ...reqValues.reqControls,
              "MerchManagerSign",
              "MerchManagerSignDate",
              props.name,
            ];
      props.name !== "MerchManagerApproved"
        ? updateMarsNew({
            MerchSign: !!checked ? reqValues.userDispplayName : "",
            MerchSignDate: !!checked ? moment().format("MM/DD/YYYY") : "",
            [props.name]: !!checked,
          })
        : updateMarsNew({
            MerchManagerSign: !!checked ? reqValues.userDispplayName : "",
            MerchManagerSignDate: !!checked
              ? moment().format("MM/DD/YYYY")
              : "",
            [props.name]: !!checked,
          });
      props.name !== "MerchManagerApproved"
        ? updateMarsReqValidation({
            MerchSign: !!checked,
            MerchSignDate: !!checked,
            [props.name]: !!checked,
          })
        : updateMarsReqValidation({
            MerchManagerSign: !!checked,
            MerchManagerSignDate: !!checked,
            [props.name]: !!checked,
          });
      props.name !== "MerchManagerApproved"
        ? updateReqValues({
            reqControls: chngCntrls,
            submitToPlanMgr: !!checked,
          })
        : updateReqValues({
            reqControls: chngCntrls,
            MerchManagerApproved: !!checked,
          });
    }
    // else if (props.name === "MerchManagerApproved") {
    //   const chngCntrls = [
    //     ...reqValues.reqControls,
    //     "MerchManagerSign",
    //     "MerchManagerSignDate",
    //     props.name,
    //   ];
    //   updateMarsNew({
    //     MerchManagerSign: !!checked ? reqValues.userDispplayName : "",
    //     MerchManagerSignDate: !!checked ? moment().format("MM/DD/YYYY") : "",
    //     [props.name]: !!checked,
    //   });
    //   updateMarsReqValidation({
    //     MerchManagerSign: !!checked,
    //     MerchManagerSignDate: !!checked,
    //     [props.name]: !!checked,
    //   });
    //   updateReqValues({
    //     reqControls: chngCntrls,
    //     MerchManagerApproved: !!checked,
    //     MerchManagerSign: !!checked ? reqValues.userDispplayName : "",
    //     MerchManagerSignDate: !!checked ? moment().format("MM/DD/YYYY") : "",
    //   });
    // }
    else if (
      [
        "DCReject",
        "DCArchived",
        "DCApproved",
        "FCApproved",
        "FCArchived",
        "FCRejected",
      ].indexOf(props.name) > -1
    ) {
      const chngCntrls =
        ["DCReject", "DCArchived", "DCApproved"].indexOf(props.name) > -1
          ? [...reqValues.reqControls, "DCSign", "DCSignDate", props.name]
          : [...reqValues.reqControls, "FCSign", "FCSignDate", props.name];
      ["DCReject", "DCArchived", "DCApproved"].indexOf(props.name) > -1
        ? updateMarsNew({
            DCSign: !!checked ? reqValues.userDispplayName : "",
            DCSignDate: !!checked ? moment().format("MM/DD/YYYY") : "",
            [props.name]: !!checked,
          })
        : updateMarsNew({
            FCSign: !!checked ? reqValues.userDispplayName : "",
            FCSignDate: !!checked ? moment().format("MM/DD/YYYY") : "",
            [props.name]: !!checked,
          });
      ["DCReject", "DCArchived", "DCApproved"].indexOf(props.name) > -1
        ? updateMarsReqValidation({
            DCSign: !!checked,
            DCSignDate: !!checked,
            [props.name]: !!checked,
          })
        : updateMarsReqValidation({
            FCSign: !!checked,
            FCSignDate: !!checked,
            [props.name]: !!checked,
          });
      updateReqValues({
        reqControls: chngCntrls,
      });
    } else if (props.name === "MarsStyleChange") {
      if (
        !!checked &&
        marsNew.NBCStyle !== "" &&
        marsNew.NBCStyle === marsNew.NewNBCStyle
      ) {
        updateReqValues({
          newNbcError: {
            ...reqValues.newNbcError,
            styleChange: !!checked,
            errMsg: "Both NbcStyle and NewNbcStyle cannot be same.",
          },
        });
      } else {
        updateReqValues({
          newNbcError: {
            ...reqValues.newNbcError,
            styleChange: !!checked,
            errMsg: "",
          },
        });
      }
      updateMarsNew({
        [props.name]: !!checked,
      });
    } else {
      updateMarsNew({
        [props.name]: !!checked,
      });
      updateMarsReqValidation({
        [props.name]: !!checked,
      });
      updateReqValues({
        reqControls: [...reqValues.reqControls, props.name],
      });
    }
  };
  return (
    <>
      {reqValues.displayMode === 4 ? (
        <>
          <StackItem>
            <MarsLabel text={props.label} required={props.required} />
            <Checkbox
              checked={props.isChecked}
              onChange={_onChange}
              disabled={true}
            />
          </StackItem>
        </>
      ) : (
        <StackItem>
          <MarsLabel text={props.label} required={props.required} />
          <Checkbox
            checked={reqChecked}
            onChange={_onChange}
            disabled={props.disable}
          />
          {marsNew.RequestType === "Reticket Form" &&
            props.name === "ControlFiles" &&
            !marsNew.ControlFiles &&
            !marsItem.ControlFiles && (
              <p className={styles.errorMessage}>
                Must be checked for Reticket.
              </p>
            )}
          <p className={styles.errorMessage}>
            {reqValues.submitClk &&
            !reqChecked &&
            ReqCheckBox_NonReq.indexOf(props.name) === -1
              ? marsNew.RequestType === "Reticket Form" &&
                ReTicket_Req.indexOf(props.name) > -1
                ? "Cannot be blank."
                : ""
              : ""}
          </p>
        </StackItem>
      )}
    </>
  );
};

export default MarsCheckBox;
