import * as React from "react";
import { IOrgInfo, IPeopleItems } from "../../Interfaces/IMarsForm";
import { AccordionItemPanel } from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import { Stack, StackItem, TextField } from "@fluentui/react";
import styles from "../../MarsForms.module.scss";
import { MarsTextBox } from "../UI/TextBox";
import MarsCheckBox from "../UI/CheckBox";
import { MarsSelect } from "../UI/Dropdown";
import { MarsPeoplePicker } from "../UI/PeoplePicker";
import * as _ from "lodash";
import * as moment from "moment";
import { MarsChoice } from "../UI/ChoiceGroup";
import { useStore } from "../../../store/useStore";

export const DcInformation = (props: IOrgInfo): JSX.Element => {
  const {
    reqValues,
    marsItem,
    updateMarsNew,
    updateMarsReqValidation,
    updateReqValues,
    marsReqValidation,
    marsNew,
  } = useStore();

  //const [impact, setImpact] = React.useState<number>(0);

  React.useEffect(() => {
    updateMarsNew({
      DCUnitsActedOn:
        marsItem?.DCUnitsActedOn !== null ? marsItem?.DCUnitsActedOn : null,
      DCWorkCompletedById:
        marsItem?.DCWorkCompletedById !== null
          ? marsItem?.DCWorkCompletedById
          : 0,
      DCOptions: marsItem?.DCOptions !== null ? marsItem?.DCOptions : "",
      OverAllRetailImpact: marsItem?.OverAllRetailImpact,
      DCOptionComments:
        marsItem?.DCOptionComments !== null ? marsItem?.DCOptionComments : "",
      PrintMARS: marsItem?.PrintMARS !== null ? marsItem?.PrintMARS : false,
      DCApproved: marsItem?.DCApproved,
      DCArchived: marsItem?.DCArchived,
      DCReject: marsItem?.DCReject,
      DCPhysicallyReTicketed: marsItem?.DCPhysicallyReTicketed,
      ReasonForReject:
        marsItem?.ReasonForReject !== null ? marsItem?.ReasonForReject : "",
      DCComments: marsItem?.DCComments !== null ? marsItem?.DCComments : "",
      DCSign: marsItem?.DCSign !== null ? marsItem?.DCSign : "",
      DCSignDate: marsItem?.DCSignDate !== null ? marsItem?.DCSignDate : "",
    });
    updateMarsReqValidation({
      DCWorkCompletedById:
        marsItem?.DCWorkCompletedById !== 0 &&
        marsItem?.DCWorkCompletedById !== null
          ? true
          : false,
    });
  }, [marsItem]);

  // React.useEffect(() => {
  //   const test =
  //     marsNew.DCUnitsActedOn !== undefined ? marsNew.DCUnitsActedOn : 0;
  //   setImpact(test + 321);
  // }, [marsNew.DCUnitsActedOn]);

  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.dcApproval}>
        <StackItem>
          <MarsTextBox
            label={"Units acted on by Distribution Center"}
            required={true}
            name={"DCUnitsActedOn"}
            type={"number"}
            val={
              marsNew.DCUnitsActedOn !== null
                ? marsNew.DCUnitsActedOn?.toString()
                : ""
            }
            MaxLen={256}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit &&
                !reqValues.fcStatus)
            }
          />
        </StackItem>
        <StackItem>
          <MarsPeoplePicker
            label="Work Completed By"
            context={props.context}
            webAbsoluteUrl={props.context.pageContext.web.absoluteUrl}
            ensureUser={true}
            defaultSelectedUsers={[marsItem.DCApproverEmail]}
            onChange={(items: IPeopleItems[]) => {
              if (items.length > 0) {
                const userIds = _.map(items, "id");
                const userTitle = _.map(items, "text");
                console.log(`my people - `, userIds, userTitle);
                updateMarsNew({
                  DCApproverEmail: userTitle.toString(),
                  DCWorkCompletedById: parseInt(userIds[0]),
                });
              } else {
                updateMarsNew({
                  DCApproverEmail: "",
                  DCWorkCompletedById: 0,
                });
                console.log(`my people - `, items);
              }
              updateMarsReqValidation({
                DCWorkCompletedById: items.length > 0 ? true : false,
                DCApproverEmail: items.length > 0 ? true : false,
              });
              updateReqValues({
                reqControls: [
                  ...reqValues.reqControls,
                  "DCWorkCompletedById",
                  "DCApproverEmail",
                ],
              });
            }}
            groupName=""
            required={false}
            searchTextLimit={3}
            valid={true}
            titleText={""}
            disabled={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit &&
                !reqValues.fcStatus)
            }
          />
          <p className={styles.errorMessage}>
            {reqValues.submitClk &&
            (!marsReqValidation.DCWorkCompletedById ||
              marsNew.DCWorkCompletedById === 0)
              ? "Cannot be blank."
              : ""}
          </p>
        </StackItem>
        <StackItem>
          <Stack
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <StackItem style={{ width: "48%" }}>
              <MarsTextBox
                label={"Processed Units"}
                required={true}
                name={"DCProcessed"}
                type={"text"}
                val={
                  marsNew.DCProcessed
                    ? marsNew.DCProcessed?.toString()
                    : marsItem?.DCProcessed
                }
                MaxLen={256}
                disable={
                  (!reqValues.roleAccess.rqDcMgr &&
                    marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
                  (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                    !reqValues.dcMgrEdit &&
                    !reqValues.fcStatus)
                }
              />
            </StackItem>
            <StackItem style={{ width: "48%" }}>
              <MarsTextBox
                label={"UnProcessed Units"}
                required={false}
                name={"DCUnProcessed"}
                type={"text"}
                val={
                  marsNew.DCUnProcessed
                    ? marsNew.DCUnProcessed?.toString()
                    : marsItem?.DCUnProcessed
                }
                MaxLen={256}
                disable={
                  (!reqValues.roleAccess.rqDcMgr &&
                    marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
                  (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                    !reqValues.dcMgrEdit &&
                    !reqValues.fcStatus)
                }
              />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem>
          <TextField
            label={"Overall Retail Impact = $"}
            required={marsNew?.RequestType !== "Locator Inquiry"}
            name={"OverAllRetailImpact"}
            type={"text"}
            value={
              marsNew?.RequestType !== "Locator Inquiry"
                ? marsNew.DCUnitsActedOn
                  ? (
                      marsNew.DCUnitsActedOn *
                      (marsItem.Retail - marsItem.NewRetail)
                    ).toString()
                  : "0"
                : ""
              // impact.toString()
            }
            disabled={true}
          />
        </StackItem>
        <StackItem>
          <MarsSelect
            layout={"oneColumn"}
            options={reqValues.DcOptions}
            label={"DC Options"}
            multiSelect={false}
            required={true}
            name={"DCOptions"}
            value={marsItem.DCOptions}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit &&
                !reqValues.fcStatus)
            }
          />
        </StackItem>
        <StackItem>
          <MarsCheckBox
            label={"Print MARS"}
            name={"PrintMARS"}
            isChecked={marsNew.PrintMARS ? marsNew.PrintMARS : false}
            required={false}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit &&
                !reqValues.fcStatus)
            }
          />
        </StackItem>
      </Stack>

      <StackItem></StackItem>
      {/* <Stack className={styles.dcApproverComments}>
        {marsNew.DCOptions === "Other(Add Comments)" && (
          <StackItem>
            <MarsTextBox
              label={"DC Comments"}
              required={true}
              name={"DCOptionComments"}
              multiline={true}
              type={"text"}
              val={
                marsNew.DCOptionComments !== null
                  ? marsNew.DCOptionComments
                  : ""
              }
              MaxLen={65000}
              disable={
                (!reqValues.roleAccess.rqDcMgr &&
                  marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
                (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                  !reqValues.dcMgrEdit &&
                  !reqValues.fcStatus)
              }
            />
          </StackItem>
        )}
      </Stack> */}
    </AccordionItemPanel>
  );
};

export const DcApproval = (props: IOrgInfo): JSX.Element => {
  const { reqValues, marsNew, marsItem } = useStore();
  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.dcApproval}>
        <StackItem>
          <MarsCheckBox
            label={"Approve and Send to FC"}
            name={"DCApproved"}
            isChecked={marsNew.DCApproved ? marsNew.DCApproved : false}
            required={false}
            disable={
              marsNew.DCArchived ||
              marsNew.DCReject ||
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
        <StackItem>
          <MarsChoice
            label="Physically Re-Ticketed - Only applicable to Retickets"
            value={
              marsNew.DCPhysicallyReTicketed
                ? marsNew.DCPhysicallyReTicketed
                : ""
            }
            name="DCPhysicallyReTicketed"
            required={false}
            type="merchpanel"
            options={reqValues.DcReTicketed}
            disable={
              marsItem.RequestType !== "Reticket Form"
                ? true
                : (!reqValues.roleAccess.rqDcMgr &&
                    marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
                  (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                    !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
        <StackItem>
          <MarsCheckBox
            label={"Close and Archive - Request will not be sent to FC"}
            name={"DCArchived"}
            isChecked={marsNew.DCArchived ? marsNew.DCArchived : false}
            required={false}
            disable={
              marsNew.RequestType === "Reticket Form" ||
              marsNew.DCApproved ||
              marsNew.DCReject ||
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
        <StackItem>&nbsp;</StackItem>
        <StackItem>
          <MarsCheckBox
            label={"Reject and Send back to Planning Initiator"}
            name={"DCReject"}
            isChecked={marsNew.DCReject ? marsNew.DCReject : false}
            required={false}
            disable={
              marsNew.DCApproved ||
              marsNew.DCArchived ||
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
          <p className={styles.errorMessage}>
            {reqValues.submitClk &&
            !(marsNew.DCApproved || marsNew.DCArchived || marsNew.DCReject)
              ? "Please select any one from Approve or Reject or Close & Archive."
              : ""}
          </p>
        </StackItem>
        <StackItem>
          <MarsSelect
            layout={"oneColumn"}
            options={reqValues.ReasonForReject}
            label={"Reason For Reject"}
            multiSelect={false}
            required={true}
            name={"ReasonForReject"}
            value={marsItem.ReasonForReject}
            disable={
              !marsNew.DCReject ||
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
      </Stack>
      <Stack className={styles.dcApproverComments}>
        <StackItem>
          <MarsTextBox
            label={"Approve / Reject Comments"}
            required={true}
            name={"DCComments"}
            type={"text"}
            val={marsNew.DCComments}
            multiline={true}
            MaxLen={650000}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
      </Stack>
      <Stack className={styles.dcApproval}>
        <StackItem>
          <MarsTextBox
            label={"Electronic Signature"}
            required={true}
            name={"DCSign"}
            type={"text"}
            val={marsNew.DCSign}
            MaxLen={256}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
        <StackItem>
          <MarsTextBox
            label={"Date"}
            required={true}
            name={"DCSignDate"}
            type={"text"}
            val={
              marsNew.DCSignDate
                ? moment(marsNew.DCSignDate).format("MM/DD/YYYY")
                : ""
            }
            MaxLen={256}
            disable={
              (!reqValues.roleAccess.rqDcMgr &&
                marsItem?.MARSNextAction === "Awaiting for DC Approval") ||
              (marsItem?.MARSNextAction !== "Awaiting for DC Approval" &&
                !reqValues.dcMgrEdit)
            }
          />
        </StackItem>
      </Stack>
    </AccordionItemPanel>
  );
};
