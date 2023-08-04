import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Qualification.
 */
export class QualificationCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */
<<<<<<< HEAD
  
=======
>>>>>>> 0630bc811de407463885e88212c87780018fa89c
  @IsOptional()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  year: number;

  @IsDefined()
  userId: string;

}
