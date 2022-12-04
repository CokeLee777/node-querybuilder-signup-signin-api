
export class SignInRequest {

    private readonly _identifier: string;
    private readonly _password: string;

    constructor(identifier: string, password: string) {
        this._identifier = identifier;
        this._password = password;
    }

    get identifier(): string {
        return this._identifier;
    }

    get password(): string {
        return this._password;
    }
}

export class SignInResponse {

    constructor(public access_token: string) {
    }

}