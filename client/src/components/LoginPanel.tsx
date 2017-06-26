import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactIntl from "react-intl";

interface LoginPanelProps {
    userName: string;
    password: string;

    onChangeUserName?: (userName: string) => void;
    onChangePassword?: (password: string) => void;
    onClickLogin?: () => void;
}

class LoginPanel extends React.Component<LoginPanelProps & ReactIntl.InjectedIntlProps, {}> {
    private handlers = {
        changeUserName: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { onChangeUserName } = this.props;
            if (onChangeUserName) {
                onChangeUserName(event.target.value);
            }
        },
        changePassword: (event: React.ChangeEvent<HTMLInputElement>) => {
            const { onChangePassword } = this.props;
            if (onChangePassword) {
                onChangePassword(event.target.value);
            }
        },
        clickLogin: (event: React.MouseEvent<HTMLButtonElement>) => {
            const { onClickLogin } = this.props;
            if (onClickLogin) {
                onClickLogin();
            }
        }
    };

    public render() {
        const { userName, password, onChangeUserName, onChangePassword } = this.props;
        const { intl } = this.props;
        return (
            <div>
                <label className="pt-label">
                    <input
                        id="username"
                        className="pt-input pt-fill"
                        type="text"
                        placeholder={intl.formatMessage({ id: "username" })}
                        value={userName}
                        onChange={this.handlers.changeUserName}
                    />
                </label>
                <label className="pt-label">
                    <input
                        id="password"
                        className="pt-input pt-fill"
                        type="password"
                        placeholder={intl.formatMessage({ id: "password" })}
                        value={password}
                        onChange={this.handlers.changePassword}
                    />
                </label>
                <Blueprint.Button
                    className="pt-fill"
                    intent={Blueprint.Intent.PRIMARY}
                    text={intl.formatMessage({ id: "login" })}
                    onClick={this.handlers.clickLogin}
                />
            </div>
        );
    }
}

export default ReactIntl.injectIntl(LoginPanel);
