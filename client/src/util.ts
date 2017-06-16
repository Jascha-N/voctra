export class HttpRequestError extends Error {
    constructor(public readonly status: number, public readonly statusText: string) {
        super(`${status} ${statusText}`);

        this.name = "HttpRequestError";
    }
}

export const fetchJson = (input: RequestInfo, init?: RequestInit) => {
    return window.fetch(input, init)
        .then((response) => {
            if (!response.ok) {
                throw new HttpRequestError(response.status, response.statusText);
            }
            return response;
        })
        .then((response) => response.json());
};
