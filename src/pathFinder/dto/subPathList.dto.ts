import { IsDefined, IsNotEmpty } from "class-validator";
import { SubPathDto } from "./subPath.dto";

export class SubPathListDto {
    @IsNotEmpty()
    @IsDefined()
    subPaths: SubPathDto[] = [];
}
