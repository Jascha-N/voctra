import * as React from "react";

import LoginPanel from "../components/LoginPanel";

interface LoginManagerState {
    userName: string;
    password: string;
}

class LoginManager extends React.Component<{}, LoginManagerState> {
    public state = {
        userName: "",
        password: ""
    };

    private handlers = {
        changeUserName: (userName: string) => {
            this.setState({ userName });
        },
        changePassword: (password: string) => {
            this.setState({ password });
        }
    };

    public render() {
        return (
            <LoginPanel
                {...this.state}
                onChangeUserName={this.handlers.changeUserName}
                onChangePassword={this.handlers.changePassword}
            />
        );
    }
}

export default LoginManager;
