import * as React from "react";
import { hot } from "react-hot-loader";
import * as api from "../../api";
import { Dropdown, Button } from "semantic-ui-react";
import { MessageDisplay } from "../common/MessageDisplay";
import { IDropdownSelection } from "../IDropdownSelection";
import { IConnectRequest } from "../../../common/models/IConnectRequest";
import { IConnectResponse } from "../../../common/models/IConnectResponse";
import { FirstStepPage } from "./FirstStep";
import { SecondStepPage } from "./SecondStep";
import { ThirdStepPage } from "./ThirdStep";

interface IScreenState {
    WizardStage: number;
    DeploymentTarget: string;
    FirstStepEnabled: boolean;
    SecondStepEnabled: boolean;
    ThirdStepEnabled: boolean;
}

class MainPageComponent extends React.Component<{}, IScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            WizardStage: 0,
            DeploymentTarget: "",
            FirstStepEnabled: true,
            SecondStepEnabled: true,
            ThirdStepEnabled: true
        };
    }

    public async componentDidMount() {
        //
    }

    public onChangeDeploymentTarget = (target: string): void => {
        this.setState({
            DeploymentTarget: target
        });
    }

    public onReadyFirstStep = () => {
        this.setState({
            WizardStage: 1,
            FirstStepEnabled: false
        });
    }

    public onReadySecondStep = () => {
        this.setState({
            WizardStage: 2,
            SecondStepEnabled: false
        });
    }

    public onReadyThirdStep = () => {
        this.setState({
            WizardStage: 3,
            ThirdStepEnabled: false
        });
    }

    public render() {
        return (
            <>
                <FirstStepPage DeploymentTarget={this.state.DeploymentTarget}
                    onChangeDeploymentTarget={this.onChangeDeploymentTarget}
                    onReadyNextStep={this.onReadyFirstStep}
                    Enabled={this.state.FirstStepEnabled} />
                <br />
                { this.state.WizardStage >= 1 &&
                    <SecondStepPage Enabled={this.state.SecondStepEnabled}
                        onReadyNextStep={this.onReadySecondStep} />
                }
                <br />
                { this.state.WizardStage >= 2 &&
                    <ThirdStepPage Enabled={this.state.SecondStepEnabled}
                    onReadyNextStep={this.onReadyThirdStep} />
                }
            </>
        );
    }
}

export const MainPage = hot(module)(MainPageComponent);
