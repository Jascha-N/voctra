import * as classNames from "classnames";
import * as React from "react";

import App from "../components/App";
import Navigator from "../components/Navigator";

const languages = ["nl", "en"];

interface RootState {
    darkTheme: boolean;
    langId: number;
}

export default class Root extends React.Component<{}, RootState> {
    public state: RootState = {
        darkTheme: true,
        langId: 0
    };

    public render() {
        const classes = classNames({
            "pt-dark": this.state.darkTheme,
            "vt-root": true
        });

        const toggleTheme = () => {
            this.setState(({darkTheme}) => ({ darkTheme: !darkTheme }));
        };

        const switchLang = () => {
            this.setState(({langId}) => ({ langId: (langId + 1) % languages.length }));
        };

        return (
            <div className={classes}>
                <Navigator darkTheme={this.state.darkTheme} toggleTheme={toggleTheme}/>
                <App/>
            </div>
        );
    }
}
