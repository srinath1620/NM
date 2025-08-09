import * as React from "react";
import { IMarsForm } from "../Interfaces/IMarsForm";
import {
  Stack,
  StackItem,
  TextField,
  PrimaryButton,
  Overlay,
  Spinner,
  SpinnerSize,
  DefaultButton,
} from "@fluentui/react";
import {
  Accordion as Acc,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "@pnp/spfx-controls-react/lib/AccessibleAccordion";
import styles from "../MarsForms.module.scss";
import OriginalInformation from "../Controls/Panels/OriginalInformation";
import MerchandiseApproval from "../Controls/Panels/MerchandiseApproval";
import { DcApproval, DcInformation } from "../Controls/Panels/DcInformation";
import { FcApproval, FcInformation } from "../Controls/Panels/FcInformation";
import { getItem, getListColumns, updateItem } from "../services/services";
import { MarsLabel, MarsTooltipLabel } from "../Controls/UI/Labels";
import { useStore } from "../../store/useStore";
import html2canvas from "html2canvas";
import "../css/table.css";

const MarsDisplayForm = (props: IMarsForm): JSX.Element => {
  const { marsItem, updateReqValues, updateMarsItems, reqValues } = useStore();
  const [history, setHistory] = React.useState<any>([]);
  const [showLoader, setShowLoader] = React.useState<boolean>(true);
  const [imgCount, setImgCount] = React.useState<number>(0);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = React.useState<string | null>(null);
  const [_display, setDisplay] = React.useState("none");

  const decodeHtmlEntities = (encodedString: string): string => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
  };

  const handlePrint = (): void => {
    setImageData(null);
    setShowLoader(true);
    updateReqValues({
      toggleExpandCollapse: true,
    });
    if (componentRef.current) {
      html2canvas(componentRef.current, {
        useCORS: true, // To handle cross-origin images
      })
        .then((canvas: any) => {
          const imgData = canvas.toDataURL("image/png");
          if (imgCount === 0) {
            setImageData(imgData);
          } else {
            setImageData(imgData);
          }
          setImgCount(imgCount + 1);
          // Trigger the print dialog
          setDisplay("block");
          setTimeout(() => {
            setShowLoader(false);
            window.print();
            setDisplay("none");
          }, 1000);
        })
        .catch((error) => console.log(error));
    }

    if (!marsItem.PrintMARS) {
      const itemUpdate: any = {};
      itemUpdate.PrintMARS = true;
      updateItem(props.context, marsItem.ID, itemUpdate)
        .then((item) => {
          console.log(item);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  React.useEffect(() => {
    const url = window.location.href;
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const idValue = searchParams.get("ID");
    const listCols = getListColumns(props.context, "MarsRequests");
    listCols
      .then((result) => {
        updateReqValues({
          DcOptions: result?.DCOptions,
          DcReTicketed: result?.DCPhysicallyReTicketed,
          DistributionCenter: result?.DistributionCenter,
          Division: result?.Division,
          FCOptions: result?.FCOptions,
          MARSDepartment: result?.MARSDepartment,
          MerchLocation: result?.MerchLocation,
          MerchType: result?.MerchType,
          PreTicketed: result?.PreTicketed,
          ReasonForReject: result?.ReasonForReject,
          RequestType: result?.RequestType,
          userDispplayName: props.context.pageContext.user.displayName,
          displayMode: props.displayMode,
        });
        if (idValue !== null) {
          getItem(props.context, parseInt(idValue))
            .then((item: any) => {
              if (item.MarsHistory !== null) {
                setHistory(JSON.parse(decodeHtmlEntities(item?.MarsHistory)));
              }

              updateMarsItems(item);
              console.log(`Mars Req Item - `, item);
              setShowLoader(false);
            })
            .catch((error) => {
              console.log(`Api error - getItem - `, error);
              setShowLoader(false);
            });
        }
      })
      .catch((error) => {
        console.log(` rqApprovers - `, error);
      });
  }, []);

  return (
    <Stack className={styles.marsForms}>
      {imageData && (
        <img
          className="canvas"
          id={imgCount.toString()}
          src={imageData}
          alt="Captured content"
          style={{ display: `${_display}` }}
        />
      )}
      {showLoader && (
        <Stack>
          <Overlay id="marsFormOverlayId">
            <Spinner
              id="marsFormSpinnerId"
              style={{ color: "red" }}
              label="Processing..."
              size={SpinnerSize.large}
            />
          </Overlay>
        </Stack>
      )}
      <div
        ref={componentRef}
        style={{ display: `${_display === "block" ? "none" : "block"}` }}
      >
        <StackItem className={styles.editFormBtns}>
          <div>
            <PrimaryButton
              text={
                reqValues.toggleExpandCollapse ? "Collapse All" : "Expand All"
              }
              onClick={() =>
                updateReqValues({
                  toggleExpandCollapse: !reqValues.toggleExpandCollapse,
                })
              }
              type="primary"
            />
          </div>

          <div style={{ width: "40%" }}>
            <PrimaryButton
              style={{ marginLeft: "30%" }}
              text={"Print"}
              onClick={handlePrint}
              type="primary"
            />
            <DefaultButton
              style={{ float: "right" }}
              text="Close"
              onClick={() => (window.location.href = document.referrer)}
            />
          </div>
        </StackItem>
        <StackItem className={styles.marsDispForm}>
          <Acc allowMultipleExpanded={true} allowZeroExpanded={true}>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>MARS</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <Stack className={styles.MarsTwoCol}>
                  <MarsLabel text="No" required={false} />
                  <StackItem>
                    <TextField
                      readOnly
                      disabled={true}
                      value={marsItem ? marsItem.ID : ""}
                    />
                  </StackItem>
                </Stack>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>Product Information</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className={styles.marsInnerPanel}>
                <Stack className={styles.MarsTwoCol}>
                  <MarsLabel text={"Division"} required={true} />
                  <StackItem>
                    <TextField
                      readOnly
                      disabled={true}
                      value={marsItem ? marsItem.Division : ""}
                    />
                  </StackItem>
                </Stack>
                <Stack className={styles.MarsTwoCol}>
                  <MarsLabel text={"Request Type"} required={true} />
                  <StackItem>
                    <TextField
                      readOnly
                      disabled={true}
                      value={marsItem ? marsItem.RequestType : ""}
                    />
                  </StackItem>
                </Stack>
                <Stack className={styles.MarsTwoCol}>
                  <MarsLabel text={"Distribution Center"} required={true} />
                  <StackItem>
                    <TextField
                      readOnly
                      disabled={true}
                      value={
                        marsItem
                          ? marsItem.DistributionCenter?.map(
                              (dc: any) => dc.Title
                            )
                              ?.toString()
                              ?.replace(/,/g, ", ")
                          : ""
                      }
                    />
                  </StackItem>
                </Stack>
                <Stack className={styles.MarsTwoCol}>
                  <MarsTooltipLabel text={"Merch Location"} required={true} />
                  <StackItem>
                    <TextField
                      readOnly
                      disabled={true}
                      value={marsItem ? marsItem.MerchLocation : ""}
                    />
                  </StackItem>
                </Stack>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>
                  Merchandise Information
                </AccordionItemButton>
              </AccordionItemHeading>
              <OriginalInformation context={props.context} />
            </AccordionItem>
            {marsItem.RequestType === "Reticket Form" && (
              <AccordionItem
                dangerouslySetExpanded={reqValues.toggleExpandCollapse}
                style={{
                  display: `${_display === "block" ? "none" : "block"}`,
                }}
              >
                <AccordionItemHeading className={styles.sectionHeader}>
                  <AccordionItemButton>
                    Merchandise Approval
                  </AccordionItemButton>
                </AccordionItemHeading>
                <MerchandiseApproval context={props.context} />
              </AccordionItem>
            )}

            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>
                  Distribution Center Information
                </AccordionItemButton>
              </AccordionItemHeading>
              <DcInformation context={props.context} />
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>
                  Distribution Center Approval / Rejection
                </AccordionItemButton>
              </AccordionItemHeading>
              <DcApproval context={props.context} />
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>
                  Financial Control Information
                </AccordionItemButton>
              </AccordionItemHeading>
              <FcInformation context={props.context} />
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>
                  Financial Control Approval
                </AccordionItemButton>
              </AccordionItemHeading>
              <FcApproval context={props.context} />
            </AccordionItem>
            <AccordionItem
              dangerouslySetExpanded={reqValues.toggleExpandCollapse}
              style={{ display: `${_display === "block" ? "none" : "block"}` }}
            >
              <AccordionItemHeading className={styles.sectionHeader}>
                <AccordionItemButton>History</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className={styles.dispSecHeader}>
                <Stack style={{ margin: "1%" }}>
                  <table
                    className={styles.tableDispSection}
                    style={{ color: "#000" }}
                  >
                    <thead>
                      <tr>
                        <th>Revisied By</th>
                        <th>Date / Time</th>
                        <th>Description of Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history?.map((row: any, index: any) => (
                        <tr
                          key={index}
                          className={index % 2 !== 0 ? "odd-row" : ""}
                        >
                          <td>{row.RevisiedBy}</td>
                          <td>{row.DateTime}</td>
                          <td>{row.Change}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Stack>
              </AccordionItemPanel>
            </AccordionItem>
          </Acc>
        </StackItem>
      </div>
    </Stack>
  );
};

export default MarsDisplayForm;
