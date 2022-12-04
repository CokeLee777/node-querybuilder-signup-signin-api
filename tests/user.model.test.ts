import DoneCallback = jest.DoneCallback;

import {appConfig} from "../config/app.config";
import {knex} from "../config/db.config";
import {UserNotFoundError} from "../users/users.error";
import {Users, UserBuilder} from "../users/users";

const userModel = appConfig.UserModel;

describe("user.model.test", () => {

    beforeAll(async () => {
        await knex
            .insert({
                identifier: "test123",
                password: "test123!",
                username: "test"
            })
            .into("Users");
    });

    afterAll(async () => {
        await knex
            .delete()
            .from("Users");
    });

    test("save user", async () => {
        //given
        const user: Users = new UserBuilder()
            .identifier("test12345")
            .password("test12345!")
            .username("test")
            .build();

        //when
        await userModel.save(user);

        //then
        const findUser: Users = await userModel.findByIdentifier("test123");
        expect(findUser.username).toBe("test");
    });

    test("is exists user", async () => {
        //given
        const identifier = "test123";

        //when
        const isExists = await userModel.existsByIdentifier(identifier);

        //then
        expect(isExists).toBeTruthy();
    });

    test("find user by exist identifier", async () => {
        //given
        const identifier: string = "test123";

        //when
        const findUser: Users = await userModel.findByIdentifier(identifier);

        //then
        expect(findUser.username).toBe("test");
    });

    test("find user by not exist identifier", async () => {
        //given
        const identifier: string = "test12";
        try {
            //when
            const findUser: Users = await userModel.findByIdentifier(identifier);
        } catch(error) {
            //then
            expect(error).toBeInstanceOf(UserNotFoundError);
        }

    });
})