import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactI18next from "react-i18next";
import * as ReactRouter from "react-router-dom";

import Login from "./Login";

interface NavigatorProps extends ReactI18next.InjectedTranslateProps {
    currentUser?: string;
    darkTheme: boolean;
    toggleTheme: () => void;
}

const Navigator = ({ t, currentUser, darkTheme, toggleTheme }: NavigatorProps) => {
    const userText = currentUser ? currentUser : t("not-logged-in");

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
                    <Login/>
                </Blueprint.Popover>
                <Blueprint.Button className="pt-minimal" iconName={themeIcon} onClick={toggleTheme}/>
            </div>
        </nav>
    );
};

export default ReactI18next.translate("common", { wait: true })(Navigator);
