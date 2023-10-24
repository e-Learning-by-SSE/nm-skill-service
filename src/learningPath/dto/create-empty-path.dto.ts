import { IsNotEmpty } from "class-validator";

export class CreateEmptyPathRequestDto {
    @IsNotEmpty()
    owner: string;
}
