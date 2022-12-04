import {UserBuilder} from "../users";
import bcrypt from "bcryptjs";

export class SignUpRequest {

    private readonly _identifier: string;
    private readonly _password: string;
    private readonly _username: string;

    constructor(identifier: string, password: string, username: string) {
        this._identifier = identifier;
        this._password = password;
        this._username = username;
    }

    get identifier(): string {
        return this._identifier;
    }

    get password(): string {
        return this._password;
    }

    get username(): string {
        return this._username;
    }

    public toUser(){
        return new UserBuilder()
            .identifier(this._identifier)
            .password(bcrypt.hashSync(this._password, 10))
            .username(this._username)
            .build();
    }
}