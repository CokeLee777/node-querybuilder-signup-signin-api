import express, {NextFunction, Request, Response} from "express";
import {appConfig} from "../config/app.config";
import {DuplicatedUserError, InCorrectPasswordError, NotEnoughRequestDataError, UserNotFoundError} from "./users.error";
import {SignUpRequest} from "./dto/users.signup.dto";
import {SignInRequest, SignInResponse} from "./dto/users.signin.dto";

const router = express.Router();
const userService = appConfig.UserService;

router.post("/sign-up", (request: Request, response: Response, next: NextFunction) => {
    const requestBody = request.body;
    if(requestBody.identifier === undefined
        || requestBody.password === undefined
        || requestBody.username === undefined){
        throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
    }

    userService
        .signUp(new SignUpRequest(
            requestBody.identifier,
            requestBody.password,
            requestBody.username))
        .then(() => response.sendStatus(200))
        .catch((error) => next(error));
});

router.post("/sign-in", (request: Request, response: Response, next: NextFunction) => {
    const requestBody = request.body;
    if(requestBody.identifier === undefined
        || requestBody.password === undefined){
        throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
    }

    userService
        .signIn(new SignInRequest(
            requestBody.identifier,
            requestBody.password))
        .then((accessToken) =>
            response.status(200)
                .json(new SignInResponse(accessToken))
        )
        .catch((error) => next(error));
});

router.use((error: Error, request: Request, response: Response, next: NextFunction) => {

    if(error instanceof UserNotFoundError ||
        error instanceof DuplicatedUserError ||
        error instanceof InCorrectPasswordError ||
        error instanceof NotEnoughRequestDataError){
        return response.status(error.code).json({message: error.message});
    }  else {
        return response.status(500).json({message: error.message});
    }
});

export default router;