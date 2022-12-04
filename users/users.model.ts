import {knex} from "../config/db.config";
import {Users} from "./users";

export class UsersModel {

    private static instance: UsersModel;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersModel();
    }

    private constructor(){}

    public async save(user: Users) {
        await knex.insert(user)
            .into("Users");
    }

    public async existsByIdentifier(identifier: string) {
        const users: Array<Users> = await knex.select("*")
            .from("Users as U")
            .where("U.identifier", identifier);
        //유저 존재유무 반환
        if(users.length == 0) return false;
        else return true;
    }

    public async findByIdentifier(identifier: string): Promise<Users> {
        const users: Array<Users> = await knex.select("*")
            .from("Users as U")
            .where("U.identifier", identifier);

        return users[0];
    }
}