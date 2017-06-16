import * as Redux from "redux";

import * as Actions from "../actions";

enum LoginStatus {
    NotLoggedIn,
    LoggingIn,
    LoggedIn,
    Error
}

interface LoginState {
    readonly status: LoginStatus;
    readonly userName?: string;
    readonly error?: string;
}

const initialLoginState: LoginState = {
    status: LoginStatus.NotLoggedIn
};

const login = (state: LoginState = initialLoginState, action: Actions.LoginAction): LoginState => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return { ...state, status: LoginStatus.LoggingIn, userName: action.userName };
        case "LOGIN_SUCCESS":
            return { ...state, status: LoginStatus.LoggedIn };
        case "LOGIN_FAILURE":
            return { ...state, status: LoginStatus.Error, error: action.error };
    }
};

export const root = login;
