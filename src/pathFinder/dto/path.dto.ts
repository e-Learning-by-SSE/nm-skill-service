import { IsNotEmpty } from 'class-validator';

export class PathDto {
  @IsNotEmpty()
  luIDs: String[];

  constructor(luIDs: String[]) {
    this.luIDs = luIDs;
  }
}
