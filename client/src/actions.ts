export enum ActionType {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILED
}

export namespace LoginAction {
    export interface Request {
        type: ActionType.LOGIN_REQUEST;
        userName: string;
    }

    export interface Success {
        type: ActionType.LOGIN_SUCCESS;
        sessionKey: string;
    }

    export interface Failure {
        type: ActionType.LOGIN_FAILED;
        message: string;
    }
}

export type LoginAction = LoginAction.Request
                        | LoginAction.Success
                        | LoginAction.Failure;

export const login = {
    request: (userName: string) => ({ type: ActionType.LOGIN_REQUEST, userName }),
    success: (sessionKey: string) => ({ type: ActionType.LOGIN_SUCCESS, sessionKey }),
    failure: (message: string) => ({ type: ActionType.LOGIN_FAILED, message })
};
