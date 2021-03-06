import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button, Icon } from "semantic-ui-react";
import { ITaskUpdate } from "../../../common/models/ITaskUpdate";
import { Sockets } from "../../socket";
import { IMigrateRequest } from "../../../common/models/IMigrateRequest";

interface IThirdStepState {
    ContainerProgress: ITaskUpdate[];
    DisplayProgressBars: boolean;
    connectMessageSuccess?: boolean;
    connectMessage: string;
    Enabled: boolean;
}

interface IPropData {
    Enabled: boolean;
    onReadyNextStep: () => void;
    MigrateSettings: IMigrateRequest;
    EnableMigrate: boolean;
}

class RunStepComponent extends React.Component<IPropData, IThirdStepState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ContainerProgress: [],
            DisplayProgressBars: false,
            connectMessage: "",
            connectMessageSuccess: null,
            Enabled: true
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
            Enabled: false
        });
        Sockets().startContainerRunUpdateReceive(this.receiveRunUpdate);
        if (this.props.EnableMigrate) {
            const returnVal = await api.runDockerContainers(this.props.MigrateSettings);
            if (!returnVal.Success) {
                Sockets().stopContainerRunUpdateReceive();
            }
        } else {
            const returnVal = await api.runDockerContainers();
            if (!returnVal.Success) {
                Sockets().stopContainerRunUpdateReceive();
            }
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
        const enabled = this.state.Enabled && this.props.Enabled;
        return (
          <div className="row">
            <h2>Start Docker Containers</h2>
            <Button onClick={this.handleGo} disabled={!enabled}>Go!</Button>
            <p></p>
            {progressRows}
          </div>
       );
    }
}

export const RunStep = hot(module)(RunStepComponent);
