import * as React from "react";
import * as ReactI18Next from "react-i18next";

type ILoginProps = ReactI18Next.InjectedTranslateProps;

@ReactI18Next.translate(["translation"])
export default class Login extends React.Component<ILoginProps, {}> {
    public render() {
        const { t } = this.props;

        return (
            <form action="" method="post">
                <label className="pt-label">
                    <input className="pt-input pt-fill" type="text" placeholder={t("username")}/>
                </label>
                <label className="pt-label">
                    <input className="pt-input pt-fill" type="password" placeholder={t("password")}/>
                </label>
                <input type="submit" className="pt-button pt-intent-primary" value={t("login")}/>
            </form>
        );
    }
}
