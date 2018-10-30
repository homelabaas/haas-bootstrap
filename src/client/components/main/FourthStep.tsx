import * as React from "react";
import { hot } from "react-hot-loader";
import { Message } from "semantic-ui-react";

interface IPropData {
    address: string;
}

const FourthStepComponent: React.StatelessComponent<IPropData> = (props: any) => {
    const address = props.address;
    const haasUrl = "http://" + address + ":3000";
    const minioUrl = "http://" + address + ":9000";
    return <>
            <h2>Done!</h2>
            <h4>Browse to the installed software: </h4>
            <p><a href={haasUrl} target="_blank">http://{address}:3000</a> - Homelab as a Service</p>
            <p><a href={minioUrl} target="_blank">http://{address}:9000</a> - Minio</p>
        </>;
};

export const FourthStepPage = hot(module)(FourthStepComponent);
