import * as React from "react";
import * as Blueprint from "@blueprintjs/core";
import * as classNames from "classnames";

import "./App.scss";

interface IRootState {
    darkTheme: boolean;
}

export class Root extends React.Component<{}, IRootState> {
    public state: IRootState = {
        darkTheme: true
    };

    private classNames(): string {
        return classNames({
            "ss-root": true,
            "pt-dark": this.state.darkTheme
        });
    }

    private toggleTheme() {
        this.setState((state) => {
            return { darkTheme: !state.darkTheme };
        });
    }

    public render() {
        return (
            <div className={this.classNames()}>
                <div className="ss-app">
                    <Navigator/>
                    <Content/>
                </div>
            </div>
        );
    }
}

export class Navigator extends React.Component<{}, {}> {
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
                    <span className="pt-navbar-divider"></span>
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

export class Content extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="ss-content">
                Hoi!
            </div>
        );
    }
}

export class Login extends React.Component<{}, {}> {
    public render() {
        return (
            <form action="" method="post">
                <label className="pt-label">
                    <input className="pt-input pt-fill" type="text" placeholder="Gebruikersnaam"/>
                </label>
                <label className="pt-label">
                    <input className="pt-input pt-fill" type="password" placeholder="Wachtwoord"/>
                </label>
                <input type="submit" className="pt-button pt-intent-primary" value="Inloggen"/>
            </form>
        );
    }
}
