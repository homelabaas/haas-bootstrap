import * as React from "react";
import { hot } from "react-hot-loader";
import { Message } from "semantic-ui-react";

const FourthStepComponent: React.StatelessComponent<{}> = (props: any) => {
    return <>
            <h2>Done!</h2>
            <h4>Browse to the installed software: </h4>
            <p><a href="http://localhost:3000">http://localhost:3000</a> - Homelab as a Service</p>
            <p><a href="http://localhost:9000">http://localhost:9000</a> - Minio</p>
        </>;
};

export const FourthStepPage = hot(module)(FourthStepComponent);
