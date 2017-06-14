import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactI18next from "react-i18next";
import * as ReactRouter from "react-router-dom";

import Login from "./Login";

interface NavigatorProps extends ReactI18next.InjectedTranslateProps {
    currentUser?: string;
}

class Navigator extends React.Component<NavigatorProps, {}> {
    public render() {
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
                            <span className={this.userClassNames()}>{this.userText()}</span>
                        </Blueprint.Button>
                        <Login/>
                    </Blueprint.Popover>
                </div>
            </nav>
        );
    }

    private userText(): string {
        const { t, currentUser } = this.props;
        return currentUser ? currentUser : t("not-logged-in");
    }

    private userClassNames(): string {
        return classNames({
            "pt-text-muted": !this.props.currentUser,
        });
    }
}

export default ReactI18next.translate("common", { wait: true })(Navigator);
