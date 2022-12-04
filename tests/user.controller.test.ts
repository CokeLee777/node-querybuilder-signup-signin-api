import app from "../app";
import request from 'supertest';
import {knex} from "../config/db.config";
import bcrypt from "bcrypt";

describe("sign up test", () => {

    afterEach(async () => {
        await knex
            .delete()
            .from("Users");
    });

    test("correct sign up", async () => {
        //given
        const signUpRequest = {
            identifier: "test123",
            password: "test123!",
            username: "test"
        }
        //when
        const response = await request(app)
            .post("/api/users/sign-up")
            .accept("application/json")
            .send(signUpRequest);

        //then
        await expect(response.status).toBe(200);
    });

    test("incorrect sign up (duplicated identifier)", async () => {
        //given
        const signUpRequest = {
            identifier: "test123",
            password: "test123!",
            username: "test"
        }
        //when
        const response1 = await request(app)
            .post("/api/users/sign-up")
            .accept("application/json")
            .send(signUpRequest);

        const response2 = await request(app)
            .post("/api/users/sign-up")
            .accept("application/json")
            .send(signUpRequest);

        //then
        await expect(response1.status).toBe(200);
        await expect(response2.status).toBe(400);
    });
});

describe("sign in test", () => {

    beforeAll(async () => {
        await knex
            .insert({
                identifier: "test123",
                password: bcrypt.hashSync("test123!", 10),
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
        const signInRequest = {
            identifier: "test123",
            password: "test123!"
        }
        //when
        const response = await request(app)
            .post("/api/users/sign-in")
            .accept("application/json")
            .send(signInRequest);

        //then
        await expect(response.status).toBe(200);
        await expect(response.body).not.toBeUndefined();
        await expect(response.body.access_token).not.toBeUndefined();
        await expect(response.body.access_token.substring(0, 6)).toBe("Bearer");
    });

    test("incorrect sign in (incorrect identifier)", async () => {
        //given
        const signInRequest = {
            identifier: "test12",
            password: "test123!"
        }
        //when
        const response = await request(app)
            .post("/api/users/sign-in")
            .accept("application/json")
            .send(signInRequest);

        //then
        await expect(response.status).toBe(401);
        await expect(response.body.access_token).toBeUndefined();
        await expect(response.body.message).toBe("존재하지 않는 아이디 입니다");
    });

    test("incorrect sign in (incorrect password)", async () => {
        //given
        const signInRequest = {
            identifier: "test123",
            password: "test12"
        }
        //when
        const response = await request(app)
            .post("/api/users/sign-in")
            .accept("application/json")
            .send(signInRequest);

        //then
        await expect(response.status).toBe(401);
        await expect(response.body.access_token).toBeUndefined();
        await expect(response.body.message).toBe("비밀번호가 일치하지 않습니다");

    });
})