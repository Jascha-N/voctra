export interface ApiResponse {
    status: string;
    message?: string;
    payload?: any;
}

// tslint:disable:max-classes-per-file
export class HttpRequestError extends Error {
    constructor(public readonly status: number, public readonly statusText: string) {
        super(`${status} ${statusText}`);

        this.name = "HttpRequestError";
    }
}

// tslint:disable:max-classes-per-file
export class ApiError extends Error {
    constructor(public readonly status: string, public readonly message: string) {
        super(`${status} ${message}`);

        this.name = "ApiError";
    }
}

export const fetchJson = <T extends {}>(input: RequestInfo, init?: RequestInit): Promise<T> => (
    window.fetch(input, init)
        .then((response) => {
            if (!response.ok) {
                throw new HttpRequestError(response.status, response.statusText);
            }
            return response;
        })
        .then((response) => response.json())
);

export const fetchApi = <T extends {}>(input: RequestInfo, init?: RequestInit): Promise<T> => (
    fetchJson(input, init)
        .then(({ status, message, payload }: ApiResponse) => {
            if (status.substr(0, 6) === "error:") {
                throw new ApiError(status.substr(status.indexOf(":") + 1), message!);
            }
            return payload;
        })
);
