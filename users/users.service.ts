import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UsersModel} from "./users.model";
import {SignInRequest} from "./dto/users.signin.dto";
import {SignUpRequest} from "./dto/users.signup.dto";
import {DuplicatedUserError, InCorrectPasswordError, UserNotFoundError} from "./users.error";
import {Users} from "./users";

export class UsersService {

    private userModel: UsersModel;

    private static instance: UsersService;

    public static getInstance(userModel: UsersModel){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersService(userModel);
    }

    private constructor(userModel: UsersModel){
        this.userModel = userModel;
    }

    public async signUp(signUpRequest: SignUpRequest): Promise<void> {
        //회원 중복 검증
        const identifier = signUpRequest.identifier;
        if(await this.userModel.existsByIdentifier(identifier)){
            throw new DuplicatedUserError(400, "아이디가 중복됩니다");
        }
        //회원가입
        await this.userModel.save(signUpRequest.toUser());
    }

    public async signIn(signInRequest: SignInRequest): Promise<string> {
        //아이디 검증
        const user: Users = await this.userModel
            .findByIdentifier(signInRequest.identifier);
        if(user == null){
            throw new UserNotFoundError(401, "존재하지 않는 아이디 입니다");
        }
        //비밀번호 검증
        if(!bcrypt.compareSync(signInRequest.password, <string>user.password)){
            throw new InCorrectPasswordError(401, "비밀번호가 일치하지 않습니다");
        }

        return this.issueJwtToken(user);
    }

    private async issueJwtToken(user: Users): Promise<string> {

        const accessToken = jwt.sign({
            type: 'JWT',
            user_id: user.user_id,
            identifier: user.identifier,
            username: user.username
        }, String(process.env.JWT_SECRET_KEY), {
            expiresIn: process.env.JWT_EXPIRED_TIME,
            issuer: process.env.JWT_ISSUER
        });

        return process.env.JWT_PREFIX + accessToken;
    }
}