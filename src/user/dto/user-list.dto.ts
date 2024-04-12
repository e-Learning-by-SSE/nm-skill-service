import { IsDefined } from "class-validator";
import { UserWithoutChildrenDto } from "./user-without-children.dto";

export class UserListDto {
    @IsDefined()
    users: UserWithoutChildrenDto[] = [];
}
