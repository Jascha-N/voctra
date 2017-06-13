import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactI18next from "react-i18next";
import * as ReactRedux from "react-redux";

import * as i18n from "i18next";
import * as XHR from "i18next-xhr-backend";

import * as Redux from "redux";
import reduxThunk from "redux-thunk";

import Root from "./components/Root";

import * as Actions from "./actions";
import * as Reducers from "./reducers";

// Poly-fills
import "whatwg-fetch";

// Resources
import "./index.scss";

i18n.use(XHR).init({
    defaultNS: "common",
    fallbackLng: "en",
    lng: "nl",
    ns: "common"
});

const store = Redux.createStore(Reducers.root, Redux.applyMiddleware(reduxThunk));

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ReactI18next.I18nextProvider i18n={i18n}>
            <Root/>
        </ReactI18next.I18nextProvider>
    </ReactRedux.Provider>,
    document.getElementById("root")
);
