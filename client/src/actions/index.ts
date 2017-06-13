import * as ReduxThunk from "redux-thunk";

interface ILoginRequest {
    type: "LOGIN_REQUEST";
    userName: string;
    password: string;
}

export const loginRequest = (userName: string, password: string): ILoginRequest => {
    return {
        type: "LOGIN_REQUEST",
        userName,
        password,
    };
};

interface ILoginSuccess {
    type: "LOGIN_SUCCESS";
    userName: string;
}

export const loginSuccess = (userName: string): ILoginSuccess => {
    return {
        type: "LOGIN_SUCCESS",
        userName,
    };
};

interface ILoginFailure {
    type: "LOGIN_FAILURE";
    error: string;
}

export const loginFailure = (error: string): ILoginFailure => {
    return {
        type: "LOGIN_FAILURE",
        error,
    };
};

type ILogin = ReduxThunk.ThunkAction<void, {}, {}>;

export const login = (userName: string, password: string): ILogin => {
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

export type IAction = (ILoginRequest | ILoginSuccess | ILoginFailure);
