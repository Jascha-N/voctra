import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";

import App from "../components/App";

import * as messagesEn from "../translations/en.json";
import * as messagesNl from "../translations/nl.json";

interface Messages {
    [locale: string]: any;
}

const MESSAGES: Messages = {
    nl: messagesNl,
    en: messagesEn
};

interface RootState {
    language: string;
    darkTheme: boolean;
}

class Root extends React.Component<{}, RootState> {
    public state = {
        language: "en",
        darkTheme: true
    };

    private handlers = {
        toggleTheme: () => {
            this.setState((state) => ({ darkTheme: !state.darkTheme }));
        },
        switchLanguage: () => {
            this.setState((state) => ({ ...state, language: state.language === "en" ? "nl" : "en" }));
        }
    };

    public render() {
        const { language, darkTheme } = this.state;
        return (
            <ReactIntl.IntlProvider locale={language} messages={MESSAGES[language]}>
                <App
                    language={language}
                    darkTheme={darkTheme}
                    onSwitchLanguage={this.handlers.switchLanguage}
                    onToggleTheme={this.handlers.toggleTheme}
                />
            </ReactIntl.IntlProvider>
        );
    }
}

export default Root;
