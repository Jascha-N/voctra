import * as Blueprint from "@blueprintjs/core";
import * as React from "react";
import * as ReactI18next from "react-i18next";

type LoginProps = ReactI18next.InjectedTranslateProps;

const Login = ({ t }: LoginProps) => {
    return (
        <div>
            <label className="pt-label">
                <input className="pt-input pt-fill" type="text" placeholder={t("username")}/>
            </label>
            <label className="pt-label">
                <input className="pt-input pt-fill" type="password" placeholder={t("password")}/>
            </label>
            <Blueprint.Button
                className="pt-fill"
                intent={Blueprint.Intent.PRIMARY}
                text={t("login")}
            />
        </div>
    );
};

export default ReactI18next.translate("common")(Login);
