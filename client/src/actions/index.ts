import * as ReduxThunk from "redux-thunk";

import { fetchJson } from "../util";

export interface LoginRequest {
    readonly type: "LOGIN_REQUEST";
    readonly userName: string;
}

const loginRequest = (userName: string): LoginRequest => ({ type: "LOGIN_REQUEST", userName });

export interface LoginSuccess {
    readonly type: "LOGIN_SUCCESS";
}

const loginSuccess = (): LoginSuccess => ({ type: "LOGIN_SUCCESS" });

export interface LoginFailure {
    readonly type: "LOGIN_FAILURE";
    readonly error: string;
}

const loginFailure = (error: string): LoginFailure => ({ type: "LOGIN_FAILURE", error });

export type Login = ReduxThunk.ThunkAction<void, {}, {}>;

export const login = (userName: string, password: string): Login => {
    return (dispatch) => {
        dispatch(loginRequest(userName));

        const data = new FormData();
        data.append("name", userName);
        data.append("password", password);

        fetchJson("/login", { method: "POST", body: data })
            .then((json) => dispatch(loginSuccess()))
            .catch((error) => dispatch(loginFailure(error)));
    };
};

export type LoginAction = LoginRequest | LoginSuccess | LoginFailure;
