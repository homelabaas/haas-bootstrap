import * as React from "react";
import { hot } from "react-hot-loader";
import { Message } from "semantic-ui-react";

interface IMessageData {
    messageSuccess?: boolean; // error or ok
    message: string;
}

const MessagePositive = (props: any) => (
    <Message positive>
      <Message.Header>OK</Message.Header>
      {props.children}
    </Message>
);

const MessageNegative = (props: any) => (
    <Message negative>
      <Message.Header>Error</Message.Header>
      {props.children}
    </Message>
);

const MessageDisplayComponent: React.StatelessComponent<IMessageData> = (props: any) => {
    if (props.messageSuccess === true) {
        return <MessagePositive>{props.message}</MessagePositive>;
    } else if (props.messageSuccess === false) {
        return <MessageNegative>{props.message}</MessageNegative>;
    }
    return null;
};

export const MessageDisplay = hot(module)(MessageDisplayComponent);
