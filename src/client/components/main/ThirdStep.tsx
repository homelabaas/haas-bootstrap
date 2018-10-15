import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button, Icon } from "semantic-ui-react";
import { ITaskUpdate } from "../../../common/models/ITaskUpdate";
import { Sockets } from "../../socket";

interface IThirdStepState {
    ContainerProgress: ITaskUpdate[];
    DisplayProgressBars: boolean;
    connectMessageSuccess?: boolean;
    connectMessage: string;
    Disabled: boolean;
}

interface IPropData {
    onReadyNextStep: () => void;
}

class ThirdStepComponent extends React.Component<IPropData, IThirdStepState> {
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

    public receiveRunUpdate = async (data: ITaskUpdate) => {
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
        Sockets().startContainerRunUpdateReceive(this.receiveRunUpdate);
        const returnVal = await api.runDockerContainers();
        if (!returnVal.Success) {
            Sockets().stopContainerRunUpdateReceive();
        }
    }

    public render() {
        const progressRows = this.state.ContainerProgress.map((p) => {
            return <div>{p.Description}
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
            <h2>Step 3 - Run Docker Containers</h2>
            <Button onClick={this.handleGo} disabled={this.state.Disabled}>Go!</Button>
            <p></p>
            {progressRows}
          </div>
       );
    }
}

export const ThirdStepPage = hot(module)(ThirdStepComponent);
