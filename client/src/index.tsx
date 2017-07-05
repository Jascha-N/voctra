import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactIntl from "react-intl";
import * as ReactRedux from "react-redux";
import * as ReactRouter from "react-router-dom";
import * as Redux from "redux";

import * as localeDataEn from "react-intl/locale-data/en";
import * as localeDataNl from "react-intl/locale-data/nl";

import Root from "./containers/Root";
import { rootReducer } from "./state";

ReactIntl.addLocaleData(localeDataEn);
ReactIntl.addLocaleData(localeDataNl);

const store = Redux.createStore(rootReducer);

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ReactRouter.BrowserRouter>
            <Root/>
        </ReactRouter.BrowserRouter>
    </ReactRedux.Provider>,
    document.getElementById("root")
);
