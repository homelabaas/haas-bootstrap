import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Button, Icon } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { Sockets } from "../../socket";
import { ITaskUpdate } from "../../../common/models/ITaskUpdate";

interface ISecondStepState {
    ContainerProgress: ITaskUpdate[];
    DisplayProgressBars: boolean;
    connectMessageSuccess?: boolean;
    connectMessage: string;
    Disabled: boolean;
}

interface IPropData {
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

    public receivePullUpdate = async (data: ITaskUpdate) => {
        const existingContainerProgress = this.state.ContainerProgress.find((p) => p.Name === data.Name);
        if (existingContainerProgress === undefined) {
            const newContainerProgress =  Object.assign(this.state.ContainerProgress, {});
            newContainerProgress.push(data);
            this.setState({
                ContainerProgress: newContainerProgress
            });
        } else {
            const newContainerProgress =  Object.assign(this.state.ContainerProgress, {});
            newContainerProgress.find((p) => p.Name === data.Name).InProgress = data.InProgress;
            newContainerProgress.find((p) => p.Name === data.Name).IsFinished = data.IsFinished;
            if (newContainerProgress.filter((p) => p.IsFinished).length === newContainerProgress.length) {
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
            return <div key={p.Name}>{p.Description}
                { p.InProgress &&
                    <Icon loading name="spinner" />
                }
                { p.IsFinished &&
                    <Icon name="check" />
                }
            </div>;
        });
        return (
          <div className="row">
            <h2>Step 2 - Download Docker Containers</h2>
            <Button onClick={this.handleGo} disabled={this.state.Disabled}>Go!</Button>
            <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />
            <p></p>
            {progressRows}
          </div>
       );
    }
}

export const SecondStepPage = hot(module)(SecondStepComponent);
