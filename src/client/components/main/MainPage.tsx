import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { IDropdownSelection } from "../IDropdownSelection";
import { IConnectRequest } from "../../../common/models/IConnectRequest";
import { IConnectResponse } from "../../../common/models/IConnectResponse";

interface IScreenState {
    DeploymentTargetDropdown: IDropdownSelection[];
    DeploymentTarget: string;
    connectMessageSuccess?: boolean;
    connectMessage: string;
}

class MainPageComponent extends React.Component<{}, IScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            DeploymentTargetDropdown: [],
            DeploymentTarget: "",
            connectMessage: "",
            connectMessageSuccess: null
        };
    }

    public async componentDidMount() {
        const deployment = await api.getOptions();
        const deploymentTargetDropdown = deployment.Options.map((p) => {
            return {
                key: p.Id.toString(),
                value: p.Id.toString(),
                text: p.Description
            };
        });

        if (deployment) {
            this.setState({
                DeploymentTargetDropdown: deploymentTargetDropdown,
                DeploymentTarget: deployment.default
             });
        }
    }

    public handleTargetChange = async (event: any, data: any) => {
        const deploymentTarget = data.value;
        this.setState({
            DeploymentTarget: deploymentTarget
        });
    }

    public handleConnect = async () => {
        const connectRequest: IConnectRequest = {
            Type: this.state.DeploymentTarget
        };
        const connectResponse = await api.connectToDocker(connectRequest);
        this.setState({
            connectMessage: connectResponse.Message,
            connectMessageSuccess: connectResponse.Success
        });
    }

    public render() {
        return (
          <div className="row">
            <h2>Step 1 - Connect to Docker</h2>
            <h4>Select your environment:</h4>
            <Dropdown fluid selection value={this.state.DeploymentTarget}
                                    options={this.state.DeploymentTargetDropdown} placeholder="Select"
                                    onChange={this.handleTargetChange} />
            <br />
            <Button onClick={this.handleConnect} >Connect</Button>
            <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />

          </div>
       );
    }
}

export const MainPage = hot(module)(MainPageComponent);
