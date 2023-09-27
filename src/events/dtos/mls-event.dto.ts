import { IsDefined, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class MLSEvent {
    @IsNotEmpty()
    entityType: string;

    @IsNotEmpty()
    method: string;
  
    @IsNotEmpty()
    id: string;
  

  
    constructor(entityType: string, method: string, id: string ) {
      this.entityType = entityType;
  
      this.method = method;
      this.id = id;
    }
  }
  