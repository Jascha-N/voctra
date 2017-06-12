import * as classNames from "classnames";
import * as React from "react";

import Content from "./Content";
import Navigator from "./Navigator";

interface IRootState {
    darkTheme: boolean;
}

export default class Root extends React.Component<{}, IRootState> {
    public state: IRootState = {
        darkTheme: true,
    };

    public render() {
        return (
            <div className={this.classNames()}>
                <div className="ss-app">
                    <Navigator/>
                    <Content/>
                </div>
            </div>
        );
    }

    private classNames(): string {
        return classNames({
            "pt-dark": this.state.darkTheme,
            "ss-root": true,
        });
    }

    private toggleTheme() {
        this.setState((state) => {
            return { darkTheme: !state.darkTheme };
        });
    }
}
