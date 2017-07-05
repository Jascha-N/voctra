import * as React from "react";
import * as ReactRedux from "react-redux";

import { login } from "../actions";
import LoginPanel from "../components/LoginPanel";
import { LoginState, LoginStatus } from "../state";
import { fetchApi } from "../util";

type Props = ReactRedux.DispatchProp<any> & {
    loggedIn: boolean
};

interface State {
    userName: string;
    password: string;
}

class LoginManager extends React.Component<Props, State> {
    public readonly state: State = {
        userName: "",
        password: ""
    };

    private readonly handlers = {
        changeUserName: (userName: string) => {
            this.setState({ userName });
        },
        changePassword: (password: string) => {
            this.setState({ password });
        },
        clickLogin: () => {
            const { dispatch } = this.props;
            const { userName, password } = this.state;

            dispatch(login.request(userName));
            const data = new URLSearchParams();
            data.append("name", userName);
            data.append("password", password);
            fetchApi(`/api/authenticate`, { method: "POST", body: data })
                .then(({ sessionKey }) => dispatch(login.success(sessionKey)))
                .catch((error: Error) => dispatch(login.failure(error.message)));
        }
    };

    public render() {
        const { loggedIn } = this.props;
        const { userName, password } = this.state;
        const { changeUserName, changePassword, clickLogin } = this.handlers;

        return (
            <LoginPanel
                userName={userName}
                password={password}
                loggedIn={loggedIn}
                onChangeUserName={changeUserName}
                onChangePassword={changePassword}
                onClickLogin={clickLogin}
            />
        );
    }
}

const mapStateToProps = (state: LoginState) => ({
    loggedIn: state.status === LoginStatus.LOGGED_IN
});

export default ReactRedux.connect(mapStateToProps)(LoginManager);
