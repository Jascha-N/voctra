import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactIntl from "react-intl";

interface LoginPanelProps {
    userName: string;
    password: string;
    onChangeUserName: (userName: string) => void;
    onChangePassword: (password: string) => void;
}

class LoginPanel extends React.Component<LoginPanelProps & ReactIntl.InjectedIntlProps, {}> {
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
                        onChange={this.handleChange}
                    />
                </label>
                <label className="pt-label">
                    <input
                        id="password"
                        className="pt-input pt-fill"
                        type="password"
                        placeholder={intl.formatMessage({ id: "password" })}
                        value={password}
                        onChange={this.handleChange}
                    />
                </label>
                <Blueprint.Button
                    className="pt-fill"
                    intent={Blueprint.Intent.PRIMARY}
                    text={intl.formatMessage({ id: "login" })}
                />
            </div>
        );
    }

    private readonly handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = event;
        if (target.id === "username") {
            this.props.onChangeUserName(target.value);
        } else if (target.id === "password") {
            this.props.onChangePassword(target.value);
        }
    }
}

export default ReactIntl.injectIntl(LoginPanel);
