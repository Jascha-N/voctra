import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";
import * as ReactRouter from "react-router-dom";

import VocabularyLoader from "../containers/VocabularyLoader";

import Navigator from "./Navigator";
import Trainer from "./Trainer";

interface AppProps {
    currentLocale: string;
    locales: string[];
    darkTheme: boolean;

    onToggleTheme?: () => void;
    onChangeLocale?: (locale: string) => void;
}

class App extends React.Component<AppProps, {}> {
    private toaster: Blueprint.Toaster;
    private readonly handlers = {
        refToaster: (ref: Blueprint.Toaster) => {
            this.toaster = ref;
        }
    };

    public componentDidUpdate(prevProps: Readonly<AppProps>) {
        const { currentLocale, darkTheme } = this.props;
        if (currentLocale !== prevProps.currentLocale) {
            this.toaster.show({
                message: (
                    <ReactIntl.FormattedMessage
                        id="language-changed"
                        values={{ language: <ReactIntl.FormattedMessage id={`lang.${currentLocale}`}/> }}
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
        const { currentLocale, locales, darkTheme, onToggleTheme, onChangeLocale } = this.props;
        return (
            <div className={this.classNameWithTheme()}>
                <Blueprint.Toaster
                    className={this.classNameWithTheme()}
                    position={Blueprint.Position.BOTTOM}
                    ref={this.handlers.refToaster}
                />
                <Navigator
                    currentLocale={currentLocale}
                    locales={locales}
                    darkTheme={darkTheme}
                    onToggleTheme={onToggleTheme}
                    onChangeLocale={onChangeLocale}
                />
                <div className={"vt-app"}>
                    <ReactRouter.Route path="/vocabulary" component={VocabularyLoader}/>
                    <ReactRouter.Route path="/" exact={true} component={Trainer}/>
                </div>
            </div>
        );
    }

    private classNameWithTheme(...classes: string[]): string {
        return classNames(classes, { "pt-dark": this.props.darkTheme });
    }
}

export default App;
