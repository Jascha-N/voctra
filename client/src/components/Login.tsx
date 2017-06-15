import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactIntl from "react-intl";

const Login = ({ intl }: {} & ReactIntl.InjectedIntlProps) => {
    const userName = intl.formatMessage({ id: "username" });
    const password = intl.formatMessage({ id: "password" });
    const login = intl.formatMessage({ id: "login" });

    return (
        <div>
            <label className="pt-label">
                <input className="pt-input pt-fill" type="text" placeholder={userName}/>
            </label>
            <label className="pt-label">
                <input className="pt-input pt-fill" type="password" placeholder={password}/>
            </label>
            <Blueprint.Button
                className="pt-fill"
                intent={Blueprint.Intent.PRIMARY}
                text={login}
            />
        </div>
    );
};

export default ReactIntl.injectIntl<{}>(Login);
