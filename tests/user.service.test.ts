import {appConfig} from "../config/app.config";
import {DuplicatedUserError, InCorrectPasswordError, UserNotFoundError} from "../users/users.error";
import {Users} from "../users/users";
import {SignUpRequest} from "../users/dto/users.signup.dto";
import {knex} from "../config/db.config";
import {SignInRequest} from "../users/dto/users.signin.dto";

const userService = appConfig.UserService;
const userModel = appConfig.UserModel;

describe("sign up test", () => {

    afterEach(async () => {
        await knex
            .delete()
            .from("Users");
    });

    test("correct sign up", async () => {
        //given
        const signUpRequest =
            new SignUpRequest("test123", "test123!", "test");

        //when
        await userService.signUp(signUpRequest);

        //then
        const findUser: Users = await userModel
            .findByIdentifier("test123");
        expect(findUser.username).toBe("test");
    });

    test("incorrect sign up (duplicated identifier)", async () => {
        //given
        const signUpRequest =
            new SignUpRequest("test123", "test123!", "test");
        await userService.signUp(signUpRequest);
        try {
            //when
            await userService.signUp(signUpRequest);
        } catch(error) {
            //then
            expect(error).toBeInstanceOf(DuplicatedUserError);
        }
    });
});

describe("sign in test", () => {

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

    test("correct sign in", async () => {
        //given
        const signInRequest =
            new SignInRequest("test123", "test123!");

        //when
        const accessToken: string = await userService.signIn(signInRequest);

        //then
        expect(accessToken).not.toBeUndefined();
        expect(accessToken.substring(0, 6)).toBe("Bearer");
    });

    test("incorrect sign in (incorrect identifier)", async () => {
        //given
        const signInRequest =
            new SignInRequest("test12", "test123!");
        try{
            //when
            await userService.signIn(signInRequest);
        } catch(error) {
            //then
            expect(error).toBeInstanceOf(UserNotFoundError);
        }
    });

    test("incorrect sign in (incorrect password)", async () => {
        //given
        const signInRequest =
            new SignInRequest("test123", "test123");
        try{
            //when
            await userService.signIn(signInRequest);
        } catch(error) {
            //then
            expect(error).toBeInstanceOf(InCorrectPasswordError);
        }
    });
})