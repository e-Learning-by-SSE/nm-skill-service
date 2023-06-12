import { IsNotEmpty } from 'class-validator';

export class NodeDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
