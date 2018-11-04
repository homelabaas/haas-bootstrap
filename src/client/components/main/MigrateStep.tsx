import * as React from "react";
import { hot } from "react-hot-loader";
import { Message, Button, Form, Input } from "semantic-ui-react";

interface IMigrateStepState {
    PostgresAddress: string;
    PostgresPort: number;
    PostgresUsername: string;
    PostgresPassword: string;
}

interface IPropData {
    Enabled: boolean;
    onReadyNextStep: () => void;
}

class MigrateStepComponent extends React.Component<IPropData, IMigrateStepState> {
    constructor(props: any) {
        super(props);
        this.state = {
            PostgresAddress: "",
            PostgresPort: 5432,
            PostgresUsername: "",
            PostgresPassword: ""
        };
    }

    public MigrateData = () => {
        this.props.onReadyNextStep();
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
            </div>
       );
    }
};

export const MigrateStep = hot(module)(MigrateStepComponent);
