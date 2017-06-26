import * as React from "react";

import LoginPanel from "../components/LoginPanel";
import { fetchApi } from "../util";

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
        },
        clickLogin: () => {
            const { userName, password } = this.state;
            const data = new URLSearchParams();
            data.append("name", userName);
            data.append("password", password);
            fetchApi("/api/authenticate", {
                method: "POST",
                body: data
            });
        }
    };

    public render() {
        return (
            <LoginPanel
                {...this.state}
                onChangeUserName={this.handlers.changeUserName}
                onChangePassword={this.handlers.changePassword}
                onClickLogin={this.handlers.clickLogin}
            />
        );
    }
}

export default LoginManager;
