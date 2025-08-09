import * as React from "react";
import { Log, FormDisplayMode } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import MarsNewForm from "./Forms/MarsNewForm";
import MarsEditForm from "./Forms/MarsEditForm";
import MarsDisplayForm from "./Forms/MarsDisplayForm";

//import styles from './MarsForms.module.scss';
import "./style.css";

export interface IMarsFormsProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = "MarsForms";

export default class MarsForms extends React.Component<IMarsFormsProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, "React Element: MarsForms mounted");
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, "React Element: MarsForms unmounted");
  }

  public render(): React.ReactElement<{}> {
    const { displayMode } = this.props;
    return (
      <>
        {displayMode === FormDisplayMode.New ? (
          <MarsNewForm context={this.props.context} displayMode={displayMode} />
        ) : displayMode === FormDisplayMode.Edit ? (
          <MarsEditForm
            context={this.props.context}
            displayMode={displayMode}
          />
        ) : (
          <MarsDisplayForm
            context={this.props.context}
            displayMode={displayMode}
          />
        )}
      </>
    );
  }
}
