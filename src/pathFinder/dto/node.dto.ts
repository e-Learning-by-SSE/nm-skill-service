import { IsNotEmpty, IsOptional } from 'class-validator';

export class NodeDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  metadata: string;

  
  

  constructor(id: string, meta: string ) {
    this.id = id;
    this.metadata =meta;}
}
