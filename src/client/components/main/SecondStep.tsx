import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Progress, Button } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { Sockets } from "../../socket";
import { IContainerPullInfo } from "../../../common/models/IContainerPullInfo";

interface IContainerProgess {
    Container: string;
    Progress: number;
}

interface ISecondStepState {
    ContainerProgress: IContainerProgess[];
    DisplayProgressBars: boolean;
    connectMessageSuccess?: boolean;
    connectMessage: string;
    Disabled: boolean;
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
            connectMessageSuccess: null,
            Disabled: false
        };
    }

    // Call this when this step is finished
    public FinishStepTwp = async () => {
        this.props.onReadyNextStep();
    }

    public receivePullUpdate = async (data: IContainerPullInfo) => {
        const existingContainerProgress = this.state.ContainerProgress.find((p) => p.Container === data.container);
        if (existingContainerProgress === undefined) {
            const newContainerProgress =  Object.assign(this.state.ContainerProgress, {});
            newContainerProgress.push({ Container: data.container, Progress: data.percent});
            this.setState({
                ContainerProgress: newContainerProgress
            });
        } else {
            const newContainerProgress =  Object.assign(this.state.ContainerProgress, {});
            newContainerProgress.find((p) => p.Container === data.container).Progress = data.percent;
            if (newContainerProgress.filter((p) => p.Progress === 100).length === newContainerProgress.length) {
                this.props.onReadyNextStep();
            }
            this.setState({
                ContainerProgress: newContainerProgress
            });
        }
    }

    public handleGo = async () => {
        this.setState({
            Disabled: true
        });
        Sockets().startContainerPullUpdateReceive(this.receivePullUpdate);
        const returnVal = await api.pullDockerContainers();
        if (!returnVal.Success) {
            Sockets().stopContainerPullUpdateReceive();
        }
    }

    public render() {
        const progressRows = this.state.ContainerProgress.map((p) => {
            return <Progress key={p.Container} percent={p.Progress}>{p.Container}</Progress>;
        });
        return (
          <div className="row">
            <h2>Step 2 - Download Docker Containers</h2>
            <Button onClick={this.handleGo} disabled={this.state.Disabled}>Go!</Button>
            <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />
            {progressRows}
          </div>
       );
    }
}

export const SecondStepPage = hot(module)(SecondStepComponent);
