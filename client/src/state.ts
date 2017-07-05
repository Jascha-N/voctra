import { ActionType, LoginAction } from "./actions";

export enum LoginStatus {
    NOT_LOGGED_IN,
    LOGGING_IN,
    LOGGED_IN
}

export namespace LoginState {
    export interface NotLoggedIn {
        status: LoginStatus.NOT_LOGGED_IN;
        message?: string;
    }

    export interface LoggingIn {
        status: LoginStatus.LOGGING_IN;
        userName: string;
    }

    export interface LoggedIn {
        status: LoginStatus.LOGGED_IN;
        userName: string;
        sessionKey: string;
    }
}

export type LoginState = LoginState.NotLoggedIn
                       | LoginState.LoggingIn
                       | LoginState.LoggedIn;

const initialState: LoginState = {
    status: LoginStatus.NOT_LOGGED_IN
};

export const rootReducer = (state: LoginState = initialState, action: LoginAction): LoginState => {
    switch (action.type) {
        case ActionType.LOGIN_REQUEST: {
            return {
                status: LoginStatus.LOGGING_IN,
                userName: action.userName
            };
        }
        case ActionType.LOGIN_SUCCESS: {
            return {
                status: LoginStatus.LOGGED_IN,
                sessionKey: action.sessionKey,
                userName: (state as LoginState.LoggingIn).userName
            };
        }
        case ActionType.LOGIN_FAILED: {
            return {
                status: LoginStatus.NOT_LOGGED_IN,
                message: action.message
            };
        }
        default: {
            return state;
        }
    }
};
