import {UsersModel} from "../users/users.model";
import {UsersService} from "../users/users.service";

export const appConfig = {
    UserModel: UsersModel.getInstance(),
    UserService: UsersService.getInstance(UsersModel.getInstance())
}