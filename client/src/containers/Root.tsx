import * as React from "react";
import * as ReactIntl from "react-intl";

import App from "../components/App";

import * as messagesEn from "../translations/en-US.json";
import * as messagesNl from "../translations/nl-NL.json";

interface Translations {
    [locale: string]: any;
}

interface State {
    currentLocale: string;
    darkTheme: boolean;
}

class Root extends React.Component<{}, State> {
    private static readonly TRANSLATIONS: Translations = {
        "nl-NL": messagesNl,
        "en-US": messagesEn
    };

    public readonly state: State = {
        currentLocale: "en-US",
        darkTheme: true
    };

    private readonly handlers = {
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
            <ReactIntl.IntlProvider
                locale={currentLocale}
                defaultLocale="en-US"
                messages={Root.TRANSLATIONS[currentLocale]}
            >
                <App
                    currentLocale={currentLocale}
                    locales={Object.keys(Root.TRANSLATIONS)}
                    darkTheme={darkTheme}
                    onChangeLocale={this.handlers.changeLocale}
                    onToggleTheme={this.handlers.toggleTheme}
                />
            </ReactIntl.IntlProvider>
        );
    }
}

export default Root;
