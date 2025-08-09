import * as React from "react";
import { Label, ITooltipHostStyles, TooltipHost } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";

type ILable = {
  text: string;
  required?: boolean;
};

const calloutProps = { gapSpace: 0 };

const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block", cursor: "pointer" },
};

export const MarsLabel = (props: ILable): JSX.Element => {
  return <Label required={props.required}>{props.text}</Label>;
};

export const MarsTooltipLabel = (props: ILable): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const InfoImg = require("../../Images/InfoImg.png");
  let tooltipId = useId("tooltip");
  return (
    <Label required={props.required}>
      {props.text}
      <TooltipHost
        content={"Separate MARS requests are required for Holdings and Lanes."}
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <img style={{ width: "13px" }} src={InfoImg} />
      </TooltipHost>
    </Label>
  );
};
