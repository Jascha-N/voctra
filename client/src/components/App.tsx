import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";
import * as ReactRouter from "react-router-dom";

import VocabularyLoader from "../containers/VocabularyLoader";
import Navigator from "./Navigator";

interface AppProps {
    language: string;
    darkTheme: boolean;

    onToggleTheme?: () => void;
    onSwitchLanguage?: () => void;
}

class App extends React.Component<AppProps, {}> {
    private toaster: Blueprint.Toaster;
    private handlers = {
        refToaster: (ref: Blueprint.Toaster) => {
            this.toaster = ref;
        }
    };

    public componentDidUpdate(prevProps: Readonly<AppProps>) {
        const { language, darkTheme } = this.props;
        if (language !== prevProps.language) {
            this.toaster.show({
                message: (
                    <ReactIntl.FormattedMessage
                        id="language-changed"
                        values={{ language: <ReactIntl.FormattedMessage id={`lang.${language}`}/> }}
                    />
                )
            });
        }
        if (darkTheme !== prevProps.darkTheme) {
            this.toaster.show({
                message: (
                    <ReactIntl.FormattedMessage
                        id="theme-changed"
                        values={{ theme: <ReactIntl.FormattedMessage id={darkTheme ? "theme.dark" : "theme.light"}/> }}
                    />
                )
            });
        }
    }

    public render() {
        const { darkTheme, onToggleTheme, onSwitchLanguage } = this.props;
        return (
            <div className={this.classNameWithTheme("vt-app")}>
                <Blueprint.Toaster
                    className={this.classNameWithTheme()}
                    position={Blueprint.Position.BOTTOM}
                    ref={this.handlers.refToaster}
                />
                <Navigator
                    darkTheme={darkTheme}
                    onToggleTheme={onToggleTheme}
                    onSwitchLanguage={onSwitchLanguage}
                />
                <div className="vt-content">
                    <ReactRouter.Route path="/vocabulary" component={VocabularyLoader}/>
                </div>
            </div>
        );
    }

    private classNameWithTheme(...classes: string[]): string {
        return classNames(classes, { "pt-dark": this.props.darkTheme });
    }
}

export default App;
