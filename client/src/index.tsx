import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactIntl from "react-intl";
import * as ReactRedux from "react-redux";
import * as ReactRouter from "react-router-dom";

import * as Redux from "redux";
import reduxThunk from "redux-thunk";

import Root from "./containers/Root";

import * as Actions from "./actions";
import * as Reducers from "./reducers";

import * as nlLocaleData from "react-intl/locale-data/nl";

// Poly-fills
import "whatwg-fetch";

// Resources
import "./index.scss";

ReactIntl.addLocaleData(nlLocaleData);

const store = Redux.createStore(Reducers.root, Redux.applyMiddleware(reduxThunk));

ReactDOM.render(
    <ReactRouter.BrowserRouter>
        <ReactRedux.Provider store={store}>
            <Root/>
        </ReactRedux.Provider>
    </ReactRouter.BrowserRouter>,
    document.getElementById("root")
);
