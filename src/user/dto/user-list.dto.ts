import { IsDefined } from "class-validator";
import { UserWithoutChildrenDto } from "./user.dto";

export class UserListDto {
    @IsDefined()
    users: UserWithoutChildrenDto[] = [];
}
