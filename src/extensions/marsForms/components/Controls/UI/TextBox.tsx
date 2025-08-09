import * as React from "react";
import { StackItem, TextField } from "@fluentui/react";
import styles from "../../MarsForms.module.scss";
import { MarsLabel } from "./Labels";
import { useStore } from "../../../store/useStore";
import { IErrMsgs, IMarsText } from "../../Interfaces/IMarsForm";
import { ErrMsgs } from "../../MarsConstants/MerchConstants";
import { giveDisableAndReq } from "../../MarsConstants/ValidationContants";

const giveErrorDesc = (
  name: string,
  value: string | undefined,
  validation: boolean | RegExp | undefined
): string => {
  let error = "";
  error = !value
    ? "Cannot be blank"
    : !(validation as RegExp)?.test(value)
    ? ErrMsgs[name as keyof IErrMsgs]
    : "";
  return error;
};

export const MarsTextBox = (props: IMarsText): JSX.Element => {
  const {
    updateMarsNew,
    reqValues,
    marsNew,
    updateMarsReqValidation,
    updateReqValues,
  } = useStore();
  const [txtVal, setTxtVal] = React.useState<string>("");
  const [err, setErr] = React.useState<string>("");

  React.useEffect(() => {
    if (
      props.name === "NewVendor" ||
      props.name === "NewVendorName" ||
      props.name === "NewMARSCategory" ||
      props.name === "NewNBCStyle" ||
      props.name === "NewCost" ||
      props.name === "NewRetail" ||
      props.name === "NewCompareAt" ||
      props.name === "NewULine"
    ) {
      setTxtVal(marsNew[props.name]);
    }
  }, [reqValues.reticketCopy]);

  React.useEffect(() => {
    if (
      props.name === "MerchManagerSign" ||
      props.name === "MerchManagerSignDate"
    ) {
      setTxtVal(marsNew[props.name] || "");
    }
  }, [reqValues.MerchManagerApproved]);

  React.useEffect(() => {
    if (props.name === "MerchSign" || props.name === "MerchSignDate") {
      setTxtVal(marsNew[props.name] || "");
    }
  }, [reqValues.submitToPlanMgr]);

  // React.useEffect(() => {
  //   if (props.name === "OverAllRetailImpact") {
  //     setTxtVal(marsNew.OverAllRetailImpact || "");
  //   }
  // }, [marsNew.DCUnitsActedOn]);

  React.useEffect(() => {
    if (props.name === "DCSign" || props.name === "DCSignDate") {
      setTxtVal(marsNew[props.name] || "");
    }
  }, [marsNew.DCApproved, marsNew.DCReject, marsNew.DCArchived]);

  React.useEffect(() => {
    if (props.name === "FCSign" || props.name === "FCSignDate") {
      setTxtVal(marsNew[props.name] || "");
    }
  }, [marsNew.FCApproved, marsNew.FCArchived, marsNew.FCRejected]);

  React.useEffect(() => {
    if (reqValues.displayMode !== 8 && reqValues.displayMode !== 0) {
      setTxtVal(props.val || "");
    }
  }, [reqValues.displayMode]);

  return (
    <>
      {reqValues.displayMode === 4 ? (
        <>
          <StackItem>
            <MarsLabel text={props.label} required={props.required} />
            <TextField
              readOnly
              disabled={true}
              value={props.val}
              multiline={props.multiline}
            />
          </StackItem>
        </>
      ) : (
        <>
          <StackItem>
            <TextField
              label={props.label}
              disabled={
                giveDisableAndReq(
                  marsNew.RequestType,
                  props.name,
                  marsNew.Division,
                  marsNew.DCOptions ? marsNew.DCOptions : ""
                ).disabled || props.disable
              }
              required={
                giveDisableAndReq(
                  marsNew.RequestType,
                  props.name,
                  marsNew.Division,
                  marsNew.DCOptions ? marsNew.DCOptions : ""
                ).req
              }
              multiline={props.multiline}
              maxLength={props.MaxLen}
              placeholder={props.placeholder}
              type={props.type}
              value={txtVal}
              onChange={(e, val) => {
                if (val) {
                  if (props.validation) {
                    const rqErr = giveErrorDesc(
                      props.name,
                      val,
                      props.validation
                    );
                    setErr(rqErr);
                    updateMarsReqValidation({
                      [props.name]: rqErr === "" ? true : false,
                    });

                    if (
                      props.name === "DCUnitsActedOn" &&
                      marsNew.Retail &&
                      marsNew.NewRetail
                    ) {
                      updateMarsNew({
                        [props.name]: parseInt(val),
                        OverAllRetailImpact: (
                          parseInt(val) *
                          (parseInt(marsNew.Retail) -
                            parseInt(marsNew.NewRetail))
                        ).toString(),
                      });
                    } else {
                      updateMarsNew({
                        [props.name]: val?.toString(),
                      });
                    }
                  } else {
                    if (
                      props.name === "DCUnitsActedOn" &&
                      marsNew.Retail &&
                      marsNew.NewRetail
                    ) {
                      updateMarsNew({
                        [props.name]: parseInt(val),
                        OverAllRetailImpact: (
                          parseInt(val) *
                          (parseInt(marsNew.Retail) -
                            parseInt(marsNew.NewRetail))
                        ).toString(),
                      });
                    } else {
                      updateMarsNew({
                        [props.name]:
                          props.name !== "DCUnitsActedOn"
                            ? val?.toString()
                            : parseInt(val),
                      });
                    }
                    updateMarsReqValidation({
                      [props.name]: true,
                    });
                    setErr("");
                  }
                } else {
                  updateMarsReqValidation({
                    [props.name]: false,
                  });
                  const rqErr = giveErrorDesc(
                    props.name,
                    val,
                    props.validation
                  );
                  setErr(rqErr);
                  updateMarsNew({
                    [props.name]: val?.toString(),
                  });
                }

                setTxtVal(val?.toString() || "");
                updateReqValues({
                  reqControls:
                    props.name !== "DCUnitsActedOn"
                      ? [...reqValues.reqControls, props.name]
                      : [
                          ...reqValues.reqControls,
                          props.name,
                          "OverAllRetailImpact",
                        ],
                  newNbcError: {
                    ...reqValues.newNbcError,
                    nbcStyle:
                      props.name === "NBCStyle" ? val : marsNew.NBCStyle,
                    newNbcStyle:
                      props.name === "NewNBCStyle" ? val : marsNew.NewNBCStyle,
                  },
                });
              }}
            />
            <p className={styles.errorMessage}>
              {reqValues.submitClk &&
              !txtVal &&
              giveDisableAndReq(
                marsNew.RequestType,
                props.name,
                marsNew.Division,
                marsNew.DCOptions ? marsNew.DCOptions : ""
              ).req &&
              !props.val
                ? "Cannot be blank. "
                : giveDisableAndReq(
                    marsNew.RequestType,
                    props.name,
                    marsNew.Division,
                    marsNew.DCOptions ? marsNew.DCOptions : ""
                  ).req
                ? err
                : ""}
              {props.name === "NewNBCStyle" &&
              marsNew.NBCStyle === marsNew.NewNBCStyle
                ? reqValues.newNbcError.errMsg
                : ""}
            </p>
          </StackItem>
        </>
      )}
    </>
  );
};
