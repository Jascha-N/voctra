import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactI18Next from "react-i18next";

import Root from "./components/Root";
import i18n from "./i18n";

import "./index.scss";

ReactDOM.render(
    <ReactI18Next.I18nextProvider i18n={i18n}><Root/></ReactI18Next.I18nextProvider>,
    document.getElementById("root"),
);
