import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactI18next from "react-i18next";

import Login from "./Login";

interface INavigatorProps extends ReactI18next.InjectedTranslateProps {
    currentUser?: string;
}

class Navigator extends React.Component<INavigatorProps, {}> {
    public render() {
        return (
            <nav className="ss-navbar pt-navbar">
                <div className="pt-navbar-group pt-align-left">
                    <div className="pt-navbar-heading">voctra</div>
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <span className={this.userClassNames()}>{this.userText()}</span>
                    <span className="pt-navbar-divider"/>
                    <Blueprint.Popover
                        popoverClassName="pt-popover-content-sizing"
                        position={Blueprint.Position.BOTTOM_RIGHT}
                        isModal={true}
                    >
                        <Blueprint.Button className="pt-minimal" iconName="user"/>
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

export default ReactI18next.translate("common")(Navigator);
