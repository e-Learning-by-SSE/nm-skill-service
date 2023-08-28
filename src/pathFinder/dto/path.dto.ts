import { IsNotEmpty } from 'class-validator';

export class PathDto {
  @IsNotEmpty()
  luIDs: readonly string[];

  constructor(luIDs: readonly string[]) {
    this.luIDs = luIDs;
  }
}
