import {CustomError} from "ts-custom-error";

export class UserNotFoundError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}

export class DuplicatedUserError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}

export class InCorrectPasswordError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}

export class NotEnoughRequestDataError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}