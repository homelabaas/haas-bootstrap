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
import { FourthStepPage } from "./FourthStep";
import { IDeploymentTarget } from "../IDeploymentTarget";
import * as URL from "url";

interface IScreenState {
    WizardStage: number;
    FirstStepEnabled: boolean;
    SecondStepEnabled: boolean;
    ThirdStepEnabled: boolean;
    FinalAddress: string;
}

class MainPageComponent extends React.Component<{}, IScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            WizardStage: 0,
            FirstStepEnabled: true,
            SecondStepEnabled: true,
            ThirdStepEnabled: true,
            FinalAddress: ""
        };
    }

    public async componentDidMount() {
        //
    }

    public onChangeDeploymentTarget = (target: IDeploymentTarget): void => {
        if (target.type === "dockertarget") {
            const hostname = URL.parse(target.address).hostname;
            this.setState({
                FinalAddress: hostname
            });
        } else {
            this.setState({
                FinalAddress: "localhost"
            });
        }
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
                <FirstStepPage
                    onChangeDeploymentTarget={this.onChangeDeploymentTarget}
                    onReadyNextStep={this.onReadyFirstStep}
                    Enabled={this.state.FirstStepEnabled} />
                <br />
                { this.state.WizardStage >= 1 &&
                    <SecondStepPage onReadyNextStep={this.onReadySecondStep} />
                }
                <br />
                { this.state.WizardStage >= 2 &&
                    <ThirdStepPage onReadyNextStep={this.onReadyThirdStep} />
                }
                <br />
                { this.state.WizardStage >= 3 &&
                    <FourthStepPage address={this.state.FinalAddress} />
                }
            </>
        );
    }
}

export const MainPage = hot(module)(MainPageComponent);
