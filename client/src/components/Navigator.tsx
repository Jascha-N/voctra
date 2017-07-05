import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";
import * as ReactRouter from "react-router-dom";

import LoginManager from "../containers/LoginManager";

type Props = ReactIntl.InjectedIntlProps & {
    currentUser?: string;
    currentLocale: string;
    locales: string[];
    darkTheme: boolean;

    onToggleTheme?: () => void;
    onChangeLocale?: (locale: string) => void;
};

interface Handlers {
    clickLocale: { [locale: string]: () => void };
}

class Navigator extends React.Component<Props, {}> {
    private readonly handlers: Handlers = {
        clickLocale: {}
    };

    constructor(props: Readonly<Props>) {
        super(props);
        this.updateHandlers(props);
    }

    public componentWillUpdate(nextProps: Readonly<Props>) {
        if (this.props.locales !== nextProps.locales) {
            this.updateHandlers(nextProps);
        }
    }

    public render() {
        const { intl, currentUser, currentLocale, locales, darkTheme, onToggleTheme } = this.props;

        const userText = currentUser ? currentUser : intl.formatMessage({ id: "not-logged-in" });
        const userClassName = classNames({
            "pt-text-muted": !currentUser,
        });

        const themeIcon = darkTheme ? "flash" : "moon";

        const localeMenuItems = locales.map((locale) => (
            <li key={locale}>
                <a
                    className="pt-menu-item pt-popover-dismiss"
                    tabIndex={0}
                    onClick={this.handlers.clickLocale[locale]}
                >
                    <img src={`/flags/${locale}.png`}/>
                    {" "}
                    <ReactIntl.FormattedMessage id={`lang.${locale}`}/>
                </a>
            </li>
        ));

        return (
            <nav className="vt-navbar pt-navbar pt-fixed-top">
                <div className="pt-navbar-group pt-align-left">
                    <div className="pt-navbar-heading">voctra</div>
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <Blueprint.Popover
                        popoverClassName="pt-popover-content-sizing"
                        position={Blueprint.Position.BOTTOM_RIGHT}
                        isModal={true}
                    >
                        <Blueprint.Button className="pt-minimal" rightIconName="user">
                            <span className={userClassName}>{userText}</span>
                        </Blueprint.Button>
                        <LoginManager/>
                    </Blueprint.Popover>
                    <ReactRouter.Link
                        to="/vocabulary"
                        role="button"
                        className="pt-button pt-minimal pt-icon-book"
                        tabIndex={0}
                    />
                    <Blueprint.AnchorButton className="pt-minimal" iconName={themeIcon} onClick={onToggleTheme}/>
                    <Blueprint.Popover
                        position={Blueprint.Position.BOTTOM_RIGHT}
                        isModal={true}
                    >
                        <Blueprint.AnchorButton className="vt-locale-button pt-minimal">
                            <img src={`/flags/${currentLocale}.png`}/>
                        </Blueprint.AnchorButton>
                        <ul className="pt-menu pt-elevation-1">
                            {localeMenuItems}
                        </ul>
                    </Blueprint.Popover>
                </div>
            </nav>
        );
    }

    private updateHandlers(props: Props) {
        this.handlers.clickLocale = props.locales.reduce((prev, locale) => ({
            ...prev,
            [locale]: () => {
                const { currentLocale, onChangeLocale } = this.props;
                if (onChangeLocale && locale !== currentLocale) {
                    onChangeLocale(locale);
                }
            }
        }), {});
    }
}

export default ReactIntl.injectIntl(Navigator);
