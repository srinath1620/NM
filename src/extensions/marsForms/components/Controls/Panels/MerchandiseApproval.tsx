import { AccordionItemPanel } from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import * as React from "react";
import { IOrgInfo, IPeopleItems } from "../../Interfaces/IMarsForm";
import { Stack, StackItem } from "@fluentui/react";
import styles from "../../MarsForms.module.scss";
import MarsCheckBox from "../UI/CheckBox";
import { MarsChoice } from "../UI/ChoiceGroup";
import { MarsPeoplePicker } from "../UI/PeoplePicker";
import * as _ from "lodash";
import { MarsTextBox } from "../UI/TextBox";
import { useStore } from "../../../store/useStore";
import * as moment from "moment";

// interface IAppr {
//   formData: IMarsNew;
// }

const MerchandiseApproval = (props: IOrgInfo): JSX.Element => {
  const {
    reqValues,
    marsNew,
    updateMarsNew,
    updateMarsReqValidation,
    marsReqValidation,
    marsItem,
    updateReqValues,
  } = useStore();
  React.useEffect(() => {
    if (reqValues.displayMode !== 8 && reqValues.displayMode !== 0) {
      updateMarsReqValidation({
        MerchPrimaryApproverId:
          [marsItem.MerchPrimaryApproverId].length > 0 ? true : false,
        MerchSecondaryApproverId:
          [marsItem.MerchSecondaryApproverId].length > 0 ? true : false,
      });
      updateMarsNew({
        MerchPrimaryApproverId: parseInt(marsItem.MerchPrimaryApproverId),
        MerchSecondaryApproverId: parseInt(marsItem.MerchSecondaryApproverId),
      });
    }
  }, [reqValues.displayMode]);

  return (
    <AccordionItemPanel className={styles.marsInnerPanel}>
      <Stack className={styles.merchApproval}>
        <StackItem className={styles.merchApprPplCntrl}>
          <Stack>
            <MarsCheckBox
              label={"Submit to Planning Approver"}
              name={"SubmitToPlanningMgr"}
              isChecked={
                reqValues.displayMode !== 8
                  ? !!marsItem.SubmitToPlanningMgr
                  : false
              }
              required={true}
              disable={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
          </Stack>
          <Stack>
            <MarsChoice
              label="Is PC 10 Updated"
              value={
                reqValues.displayMode !== 8
                  ? marsItem.UpdatedPC
                    ? "Yes"
                    : "No"
                  : ""
              }
              options={reqValues.PreTicketed}
              name="UpdatedPC"
              required={true}
              type="merchpanel"
              disable={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
          </Stack>
          <Stack>
            <MarsPeoplePicker
              label="Primary Approver"
              context={props.context}
              webAbsoluteUrl={props.context.pageContext.web.absoluteUrl}
              ensureUser={true}
              defaultSelectedUsers={[
                marsItem?.MerchPrimaryApproverTitle
                  ? marsItem.MerchPrimaryApproverTitle
                  : marsItem?.MerchPrimaryApprover?.EMail,
              ]}
              onChange={(items: IPeopleItems[]) => {
                if (items.length > 0) {
                  const userIds = _.map(items, "id");
                  const userTitle = _.map(items, "text");
                  console.log(`my people - `, userIds, userTitle);
                  updateMarsNew({
                    MerchPrimaryApproverTitle: userTitle.toString(),
                    MerchPrimaryApproverId: parseInt(userIds[0]),
                  });
                } else {
                  updateMarsNew({
                    MerchPrimaryApproverTitle: "",
                    MerchPrimaryApproverId: 0,
                  });
                  console.log(`my people - `, items);
                }
                updateMarsReqValidation({
                  MerchPrimaryApproverId: items.length > 0 ? true : false,
                  MerchPrimaryApproverTitle: items.length > 0 ? true : false,
                });
                updateReqValues({
                  reqControls: [
                    ...reqValues.reqControls,
                    "MerchPrimaryApproverId",
                    "MerchPrimaryApproverTitle",
                  ],
                });
              }}
              groupName="MARS-Merchandise-Managers"
              required={false}
              searchTextLimit={3}
              titleText={""}
              disabled={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
            <p className={styles.errorMessage}>
              {(reqValues.submitClk || reqValues.displayMode === 6) &&
              (!marsReqValidation.MerchPrimaryApproverId ||
                marsNew.MerchPrimaryApproverId === 0)
                ? "Cannot be blank."
                : marsNew.MerchPrimaryApproverId !== 0 &&
                  marsNew.MerchPrimaryApproverId ===
                    marsNew.MerchSecondaryApproverId
                ? "Primary and Secondary Approvers cannot be same."
                : ""}
            </p>
          </Stack>
        </StackItem>
        <StackItem className={styles.merchApprPplCntrl}>
          <Stack>&nbsp;</Stack>
          <Stack>&nbsp;</Stack>
          <Stack>
            <MarsPeoplePicker
              label="Secondary Approver"
              context={props.context}
              webAbsoluteUrl={props.context.pageContext.web.absoluteUrl}
              ensureUser={true}
              defaultSelectedUsers={[
                marsItem?.MerchSecondaryApproverTitle
                  ? marsItem.MerchSecondaryApproverTitle
                  : marsItem?.MerchSecondaryApprover?.EMail,
              ]}
              onChange={(items: IPeopleItems[]) => {
                if (items.length > 0) {
                  const userIds = _.map(items, "id");
                  const userTitle = _.map(items, "text");
                  console.log(`my people - `, userIds, userTitle);
                  updateMarsNew({
                    MerchSecondaryApproverTitle: userTitle.toString(),
                    MerchSecondaryApproverId: parseInt(userIds[0]),
                  });
                } else {
                  console.log(`my people - `, items);
                }
                updateMarsReqValidation({
                  MerchSecondaryApproverId: items.length > 0 ? true : false,
                  MerchSecondaryApproverTitle: items.length > 0 ? true : false,
                });
                updateReqValues({
                  reqControls: [
                    ...reqValues.reqControls,
                    "MerchSecondaryApproverId",
                    "MerchSecondaryApproverTitle",
                  ],
                });
              }}
              groupName="MARS-Merchandise-Managers"
              required={false}
              searchTextLimit={3}
              titleText={""}
              disabled={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
            <p className={styles.errorMessage}>
              {(reqValues.submitClk || reqValues.displayMode === 6) &&
              (!marsReqValidation.MerchSecondaryApproverId ||
                marsNew.MerchSecondaryApproverId === 0)
                ? "Cannot be blank."
                : marsNew.MerchSecondaryApproverId !== 0 &&
                  marsNew.MerchPrimaryApproverId ===
                    marsNew.MerchSecondaryApproverId
                ? "Primary and Secondary Approvers cannot be same."
                : ""}
            </p>
          </Stack>
        </StackItem>
        <StackItem className={styles.merchApprSign}>
          <Stack>
            <MarsTextBox
              label={"Electronic Signature"}
              required={true}
              name={"MerchSign"}
              type={"text"}
              val={
                reqValues.displayMode !== 8
                  ? marsItem.MerchSign
                  : marsNew.MerchSign
              }
              MaxLen={256}
              disable={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
          </Stack>
          <Stack>
            <MarsTextBox
              label={"Date"}
              required={true}
              name={"MerchSignDate"}
              type={"text"}
              val={
                reqValues.displayMode !== 8
                  ? moment(marsItem.MerchSignDate).format("MM/DD/YYYY")
                  : marsNew.MerchSignDate
              }
              MaxLen={256}
              disable={!reqValues.InitiatorEdit && reqValues.displayMode !== 8}
            />
          </Stack>
        </StackItem>
        {reqValues.displayMode !== 8 && !reqValues.InitiatorEdit && (
          <StackItem>
            <Stack>
              <hr className={styles.merchHorzLine} />
            </Stack>
            <Stack className={styles.merchApprPplCntrl}>
              <StackItem>
                <MarsCheckBox
                  label={"Planning Manager/Asst. Planner Approves"}
                  name={"MerchManagerApproved"}
                  isChecked={
                    reqValues.displayMode !== 4
                      ? !!marsNew.MerchManagerApproved
                      : !!marsItem.MerchManagerApproved
                  }
                  required={false}
                  disable={
                    (!reqValues.roleAccess.rqMerchMgr &&
                      marsItem?.MARSNextAction ===
                        "Awaiting for Merch Approval") ||
                    (!reqValues.merchMgrEdit &&
                      marsItem?.MARSNextAction !==
                        "Awaiting for Merch Approval")
                  }
                />
              </StackItem>
              <StackItem>
                <MarsTextBox
                  label={"Electronic Signature"}
                  required={true}
                  name={"MerchManagerSign"}
                  type={"text"}
                  val={marsNew.MerchManagerSign || marsItem.MerchManagerSign}
                  MaxLen={256}
                  disable={
                    (!reqValues.roleAccess.rqMerchMgr &&
                      marsItem?.MARSNextAction ===
                        "Awaiting for Merch Approval") ||
                    (!reqValues.merchMgrEdit &&
                      marsItem?.MARSNextAction !==
                        "Awaiting for Merch Approval")
                  }
                />
              </StackItem>
              <StackItem>
                <MarsTextBox
                  label={"Date"}
                  required={true}
                  name={"MerchManagerSignDate"}
                  type={"text"}
                  val={
                    reqValues.displayMode !== 8
                      ? moment(marsItem.MerchSignDate).format("MM/DD/YYYY")
                      : marsNew.MerchManagerSignDate !== null &&
                        marsNew.MerchManagerSignDate !== ""
                      ? moment(marsItem.MerchManagerSignDate).format(
                          "MM/DD/YYYY"
                        )
                      : ""
                  }
                  MaxLen={256}
                  disable={
                    (!reqValues.roleAccess.rqMerchMgr &&
                      marsItem?.MARSNextAction ===
                        "Awaiting for Merch Approval") ||
                    (!reqValues.merchMgrEdit &&
                      marsItem?.MARSNextAction !==
                        "Awaiting for Merch Approval")
                  }
                />
              </StackItem>
            </Stack>
          </StackItem>
        )}
      </Stack>
    </AccordionItemPanel>
  );
};

export default MerchandiseApproval;
