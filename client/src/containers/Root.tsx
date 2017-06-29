import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";

import App from "../components/App";

import * as messagesEn from "../translations/en-US.json";
import * as messagesNl from "../translations/nl-NL.json";

interface Messages {
    [locale: string]: any;
}

const TRANSLATIONS: Messages = {
    "nl-NL": messagesNl,
    "en-US": messagesEn
};

interface RootState {
    currentLocale: string;
    darkTheme: boolean;
}

class Root extends React.Component<{}, RootState> {
    public state: RootState = {
        currentLocale: "en-US",
        darkTheme: true
    };

    private handlers = {
        toggleTheme: () => {
            this.setState((state) => ({ darkTheme: !state.darkTheme }));
        },
        changeLocale: (locale: string) => {
            this.setState({ currentLocale: locale });
        }
    };

    public render() {
        const { currentLocale, darkTheme } = this.state;
        return (
            <ReactIntl.IntlProvider locale={currentLocale} messages={TRANSLATIONS[currentLocale]}>
                <App
                    currentLocale={currentLocale}
                    locales={Object.keys(TRANSLATIONS)}
                    darkTheme={darkTheme}
                    onChangeLocale={this.handlers.changeLocale}
                    onToggleTheme={this.handlers.toggleTheme}
                />
            </ReactIntl.IntlProvider>
        );
    }
}

export default Root;
