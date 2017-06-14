import * as Redux from "redux";

import { Action } from "../actions";

enum LoginStatus {
    NotLoggedIn,
    LoggingIn,
    LoggedIn,
    Error
}

interface LoginState {
    userName?: string;
    error?: string;
    status: LoginStatus;
}

const initialLoginState: LoginState = {
    status: LoginStatus.NotLoggedIn
};

const login: Redux.Reducer<LoginState> = (state = initialLoginState, action: Action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state, status: LoginStatus.LoggingIn
            };
        case "LOGIN_SUCCESS":
            return {
                ...state, status: LoginStatus.LoggedIn, userName: action.userName
            };
        case "LOGIN_FAILURE":
            return {
                ...state, status: LoginStatus.Error, error: action.error
            };
    }
};

export const root = login;
