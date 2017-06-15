import * as React from "react";

import LoginPanel from "../components/LoginPanel";

interface LoginManagerState {
    userName: string;
    password: string;
}

export default class LoginManager extends React.Component<{}, LoginManagerState> {
    public state = {
        userName: "",
        password: ""
    };

    public render() {
        return (
            <LoginPanel
                {...this.state}
                onChangeUserName={this.handleChangeUserName}
                onChangePassword={this.handleChangePassword}
            />
        );
    }

    private readonly handleChangeUserName = (userName: string) => {
        this.setState({userName});
    }

    private readonly handleChangePassword = (password: string) => {
        this.setState({password});
    }
}
