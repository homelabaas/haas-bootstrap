import * as React from "react";
import { hot } from "react-hot-loader";
import { ConnectStep } from "./ConnectStep";
import { DownloadStep } from "./DownloadStep";
import { DoneStep } from "./DoneStep";
import { IDeploymentTarget } from "../IDeploymentTarget";
import * as URL from "url";
import { Button, Icon } from "semantic-ui-react";
import { RunStep } from "./RunStep";
import { MigrateStep } from "./MigrateStep";
import { IMigrateRequest } from "../../../common/models/IMigrateRequest";

interface IScreenState {
    WizardStage: WizardStage;
    NewOrMigrateEnabled: boolean;
    ConnectStepEnabled: boolean;
    DownloadStepEnabled: boolean;
    RunStepEnabled: boolean;
    MigrateStepEnabled: boolean;
    ShowRestartButton: boolean;
    FinalAddress: string;
    MigrateData: boolean;
    MigrateSettings: IMigrateRequest;
}

enum WizardStage {
    Start,
    Connect,
    Download,
    Run,
    Done,
    Migrate
}

class MainPageComponent extends React.Component<{}, IScreenState> {
    constructor(props: any) {
        super(props);
        this.state = {
            WizardStage: WizardStage.Start,
            NewOrMigrateEnabled: true,
            ConnectStepEnabled: true,
            DownloadStepEnabled: true,
            RunStepEnabled: true,
            MigrateStepEnabled: true,
            ShowRestartButton: false,
            FinalAddress: "",
            MigrateData: false,
            MigrateSettings: null
        };
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

    public setMigrateSettings = (settings: IMigrateRequest) => {
        this.setState({
            MigrateSettings: settings
        });
    }

    public onReadyConnectStep = () => {
        this.setState({
            WizardStage: WizardStage.Download,
            ConnectStepEnabled: false,
            NewOrMigrateEnabled: false,
            ShowRestartButton: true
        });
    }

    public onReadyDownloadStep = () => {
        if (this.state.MigrateData) {
            this.setState({
                WizardStage: WizardStage.Migrate,
                DownloadStepEnabled: false
            });
        } else {
            this.setState({
                WizardStage: WizardStage.Run,
                DownloadStepEnabled: false
            });
        }
    }

    public onReadyMigrateStep = () => {
        this.setState({
            WizardStage: WizardStage.Run,
            MigrateStepEnabled: false
        });
    }
    public onReadyRunStep = () => {
        this.setState({
            WizardStage: WizardStage.Done,
            RunStepEnabled: false
        });
    }

    public setMigrateOption = (value: boolean) => {
        this.setState({
            MigrateData: value,
            WizardStage: WizardStage.Connect
        });
    }

    public restartClick = () => {
        this.setState({
            WizardStage: WizardStage.Start,
            NewOrMigrateEnabled: true,
            ConnectStepEnabled: true,
            DownloadStepEnabled: true,
            RunStepEnabled: true,
            MigrateStepEnabled: true,
            ShowRestartButton: false,
            FinalAddress: "",
            MigrateData: false
        });
    }

    public render() {
        return (
            <>
                { this.state.ShowRestartButton &&
                    <div>
                        <Button color="red" floated="right" onClick={this.restartClick}>
                            <Icon name="refresh" />Restart
                        </Button>
                    </div>
                }
                <div className="row">
                    <h2>New Installation or Migration</h2>
                    <Button.Group>
                        <Button positive disabled={!this.state.NewOrMigrateEnabled}
                            onClick={(evt) => { this.setMigrateOption(false); }}>New</Button>
                        <Button.Or />
                        <Button  disabled={!this.state.NewOrMigrateEnabled}
                            onClick={(evt) => { this.setMigrateOption(true); }}>Migrate</Button>
                    </Button.Group>
                    { (this.state.WizardStage !== WizardStage.Start && this.state.MigrateData) &&
                        <h2>Migration</h2>
                    }
                    { (this.state.WizardStage !== WizardStage.Start && !this.state.MigrateData) &&
                        <h2>New Installation</h2>
                    }
                </div>
                <br />
                { this.state.WizardStage !== WizardStage.Start &&
                    <ConnectStep
                        onChangeDeploymentTarget={this.onChangeDeploymentTarget}
                        onReadyNextStep={this.onReadyConnectStep}
                        Enabled={this.state.ConnectStepEnabled} />
                }
                <br />
                { (this.state.WizardStage === WizardStage.Download ||
                  this.state.WizardStage === WizardStage.Migrate ||
                  this.state.WizardStage === WizardStage.Run ||
                  this.state.WizardStage === WizardStage.Done) &&
                    <DownloadStep onReadyNextStep={this.onReadyDownloadStep}
                        Enabled={this.state.DownloadStepEnabled}/>
                }
                                <br />
                { ((this.state.WizardStage === WizardStage.Migrate ||
                  this.state.WizardStage === WizardStage.Run ||
                  this.state.WizardStage === WizardStage.Done)
                  && this.state.MigrateData) &&
                    <MigrateStep onReadyNextStep={this.onReadyMigrateStep}
                        Enabled={this.state.MigrateStepEnabled}
                        onSetMigrateSettings={this.setMigrateSettings} />
                }
                <br />
                { (this.state.WizardStage === WizardStage.Run ||
                  this.state.WizardStage === WizardStage.Done) &&
                    <RunStep onReadyNextStep={this.onReadyRunStep}
                        Enabled={this.state.RunStepEnabled}
                        EnableMigrate={this.state.MigrateData}
                        MigrateSettings={this.state.MigrateSettings} />
                }
                <br />
                { this.state.WizardStage === WizardStage.Done &&
                    <DoneStep address={this.state.FinalAddress} />
                }
            </>
        );
    }
}

export const MainPage = hot(module)(MainPageComponent);
