import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Progress , Button } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { IDropdownSelection } from "../IDropdownSelection";
import { IConnectRequest } from "../../../common/models/IConnectRequest";
import { IConnectResponse } from "../../../common/models/IConnectResponse";
import { Sockets } from "../../socket";
import { IContainerPullInfo } from "../../../common/models/IContainerPullInfo";

interface IContainerProgess {
    Name: string;
    Progress: number;
}

interface ISecondStepState {
    ContainerProgress: [];
    DisplayProgressBars: boolean;
    connectMessageSuccess?: boolean;
    connectMessage: string;
}

interface IPropData {
    Enabled: boolean;
    onReadyNextStep: () => void;
}

class SecondStepComponent extends React.Component<IPropData, ISecondStepState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ContainerProgress: [],
            DisplayProgressBars: false,
            connectMessage: "",
            connectMessageSuccess: null
        };
    }

    public async componentDidMount() {
        //
    }

    // Call this when this step is finished
    public FinishStepTwp = async () => {
        this.props.onReadyNextStep();
    }

    public receivePullUpdate = async (data: IContainerPullInfo) => {
        // do something with this info
    }

    public handleGo = async () => {
        Sockets().startContainerPullUpdateReceive(this.receivePullUpdate);
        const returnVal = await api.pullDockerContainers();
        if (!returnVal.Success) {
            Sockets().stopContainerPullUpdateReceive();
        }
    }

    public render() {
        return (
          <div className="row">
            <h2>Step 2 - Download Docker Containers</h2>
            <Button onClick={this.handleGo}>Go!</Button>
            <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />

          </div>
       );
    }
}

export const SecondStepPage = hot(module)(SecondStepComponent);
