import * as React from "react";
import { hot } from "react-hot-loader";
import { Message, Button, Form, Input } from "semantic-ui-react";
import * as api from "../../api";
import { IMigrateRequest } from "../../../common/models/IMigrateRequest";
import { MessageDisplay } from "../common/MessageDisplay";

interface IMigrateStepState {
    PostgresAddress: string;
    PostgresPort: number;
    PostgresUsername: string;
    PostgresPassword: string;
    PostgresDatabase: string;
    connectMessageSuccess?: boolean;
    connectMessage: string;
}

interface IPropData {
    Enabled: boolean;
    onReadyNextStep: () => void;
    onSetMigrateSettings: (settings: IMigrateRequest) => void;
}

class MigrateStepComponent extends React.Component<IPropData, IMigrateStepState> {
    constructor(props: any) {
        super(props);
        this.state = {
            PostgresAddress: "",
            PostgresPort: 5432,
            PostgresUsername: "",
            PostgresPassword: "",
            PostgresDatabase: "",
            connectMessage: "",
            connectMessageSuccess: null
        };
    }

    public MigrateData = async () => {
        const migrateRequest: IMigrateRequest = {
            address: this.state.PostgresAddress,
            db: this.state.PostgresDatabase,
            password: this.state.PostgresPassword,
            port: this.state.PostgresPort,
            user: this.state.PostgresUsername
        }
        const returnValue = await api.migrate(migrateRequest);
        this.setState({
            connectMessage: returnValue.Message,
            connectMessageSuccess: returnValue.Success
        });
        if (returnValue.Success) {
            this.props.onSetMigrateSettings(migrateRequest);
            this.props.onReadyNextStep();
        }
    }

    public handleAddressChange = async (event: any, data: any) => {
        this.setState({
            PostgresAddress: data.value
        });
    }

    public handlePortChange = async (event: any, data: any) => {
        this.setState({
            PostgresPort: +data.value
        });
    }

    public handleUsernameChange = async (event: any, data: any) => {
        this.setState({
            PostgresUsername: data.value
        });
    }

    public handleDbChange = async (event: any, data: any) => {
        this.setState({
            PostgresDatabase: data.value
        });
    }

    public handlePasswordChange = async (event: any, data: any) => {
        this.setState({
            PostgresPassword: data.value
        });
    }

    public render() {
        return (
            <div className="row">
                <h2>Migrate Data</h2>
                <h4>Existing Postgres Connection Details</h4>
                <Form>
                <Form.Field>
                    <label>Address</label>
                    <Input placeholder="Address" onChange={this.handleAddressChange}
                            value={this.state.PostgresAddress} disabled={!this.props.Enabled}  />
                </Form.Field>
                <Form.Field>
                    <label>Port</label>
                    <Input placeholder="Port" onChange={this.handlePortChange}
                            value={this.state.PostgresPort} disabled={!this.props.Enabled}  />
                </Form.Field>
                <Form.Field>
                    <label>Database Name</label>
                    <Input placeholder="Database Name" onChange={this.handleDbChange}
                            value={this.state.PostgresDatabase} disabled={!this.props.Enabled}  />
                </Form.Field>
                <Form.Field>
                    <label>Username</label>
                    <Input placeholder="Username" onChange={this.handleUsernameChange}
                            value={this.state.PostgresUsername} disabled={!this.props.Enabled}  />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input type="password" placeholder="Password" onChange={this.handlePasswordChange}
                            value={this.state.PostgresPassword} disabled={!this.props.Enabled}  />
                </Form.Field>
                </Form>
                <br />
                <Button disabled={!this.props.Enabled} onClick={this.MigrateData}>Migrate</Button>
                <MessageDisplay messageSuccess={this.state.connectMessageSuccess} message={this.state.connectMessage} />

            </div>
       );
    }
};

export const MigrateStep = hot(module)(MigrateStepComponent);
