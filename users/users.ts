
export class Users {

    public user_id: bigint | undefined;
    public identifier: string | undefined;
    public password: string | undefined;
    public username: string | undefined;
    public created_at: string | undefined;
}

export class UserBuilder {

    private user: Users;

    constructor() {
        this.user = new Users();
    }

    identifier(identifier: string){
        this.user.identifier = identifier;
        return this;
    }

    password(password: string){
        this.user.password = password;
        return this;
    }

    username(username: string){
        this.user.username = username;
        return this;
    }

    build() {
        return this.user;
    }
}