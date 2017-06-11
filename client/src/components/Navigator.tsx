import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactI18Next from "react-i18next";

import Login from "./Login";

export default class Navigator extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="ss-navbar pt-navbar">
                <div className="pt-navbar-group pt-align-left">
                    <div className="pt-navbar-heading">voctra</div>
                    <input className="pt-input" placeholder="Search files..." type="text" />
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <Blueprint.Button className="pt-minimal" iconName="home" text="Home"/>
                    <Blueprint.Button className="pt-minimal" iconName="document" text="Files"/>
                    <span className="pt-navbar-divider"/>
                    <Blueprint.Popover
                        popoverClassName="pt-popover-content-sizing"
                        position={Blueprint.Position.BOTTOM_RIGHT}
                        isModal={true}
                    >
                        <Blueprint.Button className="pt-minimal" iconName="user"/>
                        <Login/>
                    </Blueprint.Popover>
                    <Blueprint.Button className="pt-minimal" iconName="notifications"/>
                    <Blueprint.Button className="pt-minimal" iconName="flash"/>
                </div>
            </div>
        );
    }
}
