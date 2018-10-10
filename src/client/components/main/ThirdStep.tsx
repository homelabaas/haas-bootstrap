import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { IDropdownSelection } from "../IDropdownSelection";
import { IConnectRequest } from "../../../common/models/IConnectRequest";
import { IConnectResponse } from "../../../common/models/IConnectResponse";

interface IThirdStepState {
    //
}

interface IPropData {
    Enabled: boolean;
    onReadyNextStep: () => void;
}

class ThirdStepComponent extends React.Component<IPropData, IThirdStepState> {
    constructor(props: any) {
        super(props);
        this.state = {

        };
    }

    public async componentDidMount() {
        //
    }

    public handleGo = async () => {
        this.props.onReadyNextStep();
    }

    public render() {
        return (
          <div className="row">
            <h2>Step 3 - Run Docker Containers</h2>
            <Button onClick={this.handleGo}>Go!</Button>
          </div>
       );
    }
}

export const ThirdStepPage = hot(module)(ThirdStepComponent);
