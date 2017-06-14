import * as ReduxThunk from "redux-thunk";

interface LoginRequest {
    type: "LOGIN_REQUEST";
    userName: string;
    password: string;
}

export const loginRequest = (userName: string, password: string): LoginRequest => {
    return {
        type: "LOGIN_REQUEST",
        userName,
        password,
    };
};

interface LoginSuccess {
    type: "LOGIN_SUCCESS";
    userName: string;
}

export const loginSuccess = (userName: string): LoginSuccess => {
    return {
        type: "LOGIN_SUCCESS",
        userName,
    };
};

interface LoginFailure {
    type: "LOGIN_FAILURE";
    error: string;
}

export const loginFailure = (error: string): LoginFailure => {
    return {
        type: "LOGIN_FAILURE",
        error,
    };
};

type Login = ReduxThunk.ThunkAction<void, {}, {}>;

export const login = (userName: string, password: string): Login => {
    return (dispatch) => {
        dispatch(loginRequest(userName, password));

        const data = new FormData();
        data.append("name", userName);
        data.append("password", password);

        fetch("/login", { method: "POST", body: data })
            .then((response) => response.json(), (error) => dispatch(loginFailure(error)))
            .then((json) => dispatch(loginSuccess(userName)), (error) => dispatch(loginFailure(error)));
    };
};

export type Action = (LoginRequest | LoginSuccess | LoginFailure);
