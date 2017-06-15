import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactIntl from "react-intl";
import * as ReactRouter from "react-router-dom";

import LoginManager from "../containers/LoginManager";

interface NavigatorProps {
    currentUser?: string;
    darkTheme: boolean;
    onToggleTheme: () => void;
    onSwitchLocale: () => void;
}

const Navigator = (props: NavigatorProps & ReactIntl.InjectedIntlProps) => {
    const { intl, currentUser, darkTheme, onToggleTheme, onSwitchLocale } = props;

    const userText = currentUser ? currentUser : intl.formatMessage({ id: "not-logged-in" });
    const userClassNames = classNames({
        "pt-text-muted": !currentUser,
    });

    const themeIcon = darkTheme ? "flash" : "moon";

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
                        <span className={userClassNames}>{userText}</span>
                    </Blueprint.Button>
                    <LoginManager/>
                </Blueprint.Popover>
                <Blueprint.Button className="pt-minimal" iconName={themeIcon} onClick={onToggleTheme}/>
                <Blueprint.Button className="pt-minimal" iconName="translate" onClick={onSwitchLocale}/>
            </div>
        </nav>
    );
};

export default ReactIntl.injectIntl(Navigator);
