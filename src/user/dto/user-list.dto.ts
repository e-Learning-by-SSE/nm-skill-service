import { IsDefined } from "class-validator";
import { UserDto } from "./user.dto";

export class UserListDto {
    @IsDefined()
    users: UserDto[] = [];
}
