import * as classNames from "classnames";
import * as React from "react";

import App from "./App";
import Navigator from "./Navigator";

interface RootState {
    darkTheme: boolean;
}

export default class Root extends React.Component<{}, RootState> {
    public state = {
        darkTheme: true
    };

    public render() {
        return (
            <div className={this.classNames()}>
                <Navigator/>
                <App/>
            </div>
        );
    }

    private classNames(): string {
        return classNames({
            "pt-dark": this.state.darkTheme,
            "vt-root": true
        });
    }

    private toggleTheme() {
        this.setState((state) => {
            return { darkTheme: !state.darkTheme };
        });
    }
}
