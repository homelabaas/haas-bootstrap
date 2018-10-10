import * as React from "react";
import { hot } from "react-hot-loader";
import { Message } from "semantic-ui-react";

const FourthStepComponent: React.StatelessComponent<{}> = (props: any) => {
    return <h2>Done!</h2>;
};

export const FourthStepPage = hot(module)(FourthStepComponent);
