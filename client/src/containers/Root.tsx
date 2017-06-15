import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";

import App from "../components/App";
import Navigator from "../components/Navigator";

import * as messagesEn from "../messages/en.json";
import * as messagesNl from "../messages/nl.json";

interface Messages {
    [locale: string]: any;
}

const MESSAGES: Messages = {
    nl: messagesNl,
    en: messagesEn
};

interface RootState {
    darkTheme: boolean;
    locale: string;
}

export default class Root extends React.Component<{}, RootState> {
    public state = {
        darkTheme: true,
        locale: "en"
    };

    public render() {
        const { locale, darkTheme } = this.state;

        const classes = classNames({
            "pt-dark": darkTheme,
            "vt-root": true
        });

        return (
            <ReactIntl.IntlProvider locale={locale} key={locale} messages={MESSAGES[locale]}>
                <div className={classes}>
                    <Navigator
                        darkTheme={this.state.darkTheme}
                        onToggleTheme={this.handleToggleTheme}
                        onSwitchLocale={this.handleSwitchLocale}
                    />
                    <App/>
                </div>
            </ReactIntl.IntlProvider>
        );
    }

    private readonly handleToggleTheme = () => {
        this.setState((state) => ({ darkTheme: !state.darkTheme }));
    }

    private readonly handleSwitchLocale = () => {
        this.setState((state) => ({...state, locale: state.locale === "en" ? "nl" : "en"}));
    }
}
