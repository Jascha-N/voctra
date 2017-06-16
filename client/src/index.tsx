import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactIntl from "react-intl";
import * as ReactRedux from "react-redux";
import * as ReactRouter from "react-router-dom";

import * as Redux from "redux";
import reduxThunk from "redux-thunk";

import * as localeDataNl from "react-intl/locale-data/nl";

import Root from "./containers/Root";

import * as Reducers from "./reducers";

ReactIntl.addLocaleData(localeDataNl);

const store = Redux.createStore(Reducers.root, Redux.applyMiddleware(reduxThunk));

ReactDOM.render(
    <ReactRouter.BrowserRouter>
        {/*<ReactRedux.Provider store={store}>*/}
            <Root/>
        {/*</ReactRedux.Provider>*/}
    </ReactRouter.BrowserRouter>,
    document.getElementById("root")
);
