import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { App } from "./app";
import { MainPage } from "./components/main/MainPage";
import { hot } from "react-hot-loader";

const AppRouterComponent: React.StatelessComponent<{}> = () => {
    return (
        <BrowserRouter>
            <App>
                <Switch>
                    <Route exact path="/" component={MainPage} />
                </Switch>
            </App>
        </BrowserRouter>
    );
};

export const AppRouter = hot(module)(AppRouterComponent);
