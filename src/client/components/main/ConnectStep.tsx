import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button, Input, Form } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { IDropdownSelection } from "../IDropdownSelection";
import { IConnectRequest } from "../../../common/models/IConnectRequest";
import { IConnectResponse } from "../../../common/models/IConnectResponse";
import { IDeploymentTarget } from "../IDeploymentTarget";
import { IDeployment } from "../../../common/models/IDeployment";

interface IFirstStepState {
    deploymentTargetDropdown: IDropdownSelection[];
    deploymentTargetType: string;
    connectMessageSuccess?: boolean;
    connectMessage: string;
    targetAddress: string;
    addressRequired: boolean;
    deploymentOptions: IDeployment;
}

interface IPropData {
    Enabled: boolean;
    onChangeDeploymentTarget: (target: IDeploymentTarget) => void;
    onReadyNextStep: () => void;
}

class ConnectStepComponent extends React.Component<IPropData, IFirstStepState> {
    constructor(props: any) {
        super(props);
        this.state = {
            deploymentTargetDropdown: [],
            deploymentTargetType: "",
            connectMessage: "",
            connectMessageSuccess: null,
            targetAddress: "",
            addressRequired: false,
            deploymentOptions: { default: "", Options: [] }
        };
    }

    public async componentDidMount() {
        const deployment = await api.getOptions();
        const deploymentTargetDropdownValues = deployment.Options.map((p) => {
            return {
                key: p.Id.toString(),
                value: p.Id.toString(),
                text: p.Description
            };
        });

        if (deployment) {
            this.setState({
                deploymentTargetDropdown: deploymentTargetDropdownValues,
                deploymentOptions: deployment,
                deploymentTargetType: deployment.default
            });
            this.props.onChangeDeploymentTarget({ type: deployment.default });
        }
    }

    public handleTargetChange = async (event: any, data: any) => {
        let addressRequiredNewVal = false;
        for (const targetOption of this.state.deploymentOptions.Options) {
            if (targetOption.Id === data.value) {
                if (targetOption.RequiresTargetInfo === true) {
                    addressRequiredNewVal = true;
                }
            }
        }
        this.setState({
            deploymentTargetType: data.value,
            addressRequired: addressRequiredNewVal
        });
        this.props.onChangeDeploymentTarget({ type: data.value, address: this.state.targetAddress });
    }

    public handleConnect = async () => {
        const connectRequest: IConnectRequest = {
            Type: this.state.deploymentTargetType
        };
        if (this.state.addressRequired) {
            connectRequest.Address = this.state.targetAddress;
        }
        const connectResponse = await api.connectToDocker(connectRequest);
        this.setState({
            connectMessage: connectResponse.Message,
            connectMessageSuccess: connectResponse.Success
        });
        if (connectResponse.Success) {
            this.props.onReadyNextStep();
        }
    }

    public handleAddressChange = async (event: any, data: any) => {
        this.setState({
            targetAddress: data.value
        });
        this.props.onChangeDeploymentTarget({type: this.state.deploymentTargetType, address: data.value });
    }

    public render() {
        return (
          <div className="row">
            <h4>Select installation environment:</h4>
            <Form>
                <Form.Field>
                    <label>Deployment Type</label>
                    <Dropdown fluid selection value={this.state.deploymentTargetType}
                                    options={this.state.deploymentTargetDropdown} placeholder="Select"
                                    onChange={this.handleTargetChange}
                                    disabled={!this.props.Enabled} />
                </Form.Field>
                { this.state.addressRequired &&
                    <Form.Field>
                        <label>URL of Docker Machine</label>
                        <Input placeholder="Address" onChange={this.handleAddressChange}
                            value={this.state.targetAddress} disabled={!this.props.Enabled}  />
                    </Form.Field>
                }
                <Button onClick={this.handleConnect} disabled={!this.props.Enabled}>Connect</Button>
            </Form>
            <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />
          </div>
       );
    }
}

export const ConnectStep = hot(module)(ConnectStepComponent);
