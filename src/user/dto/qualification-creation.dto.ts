import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Qualification.
 */
export class QualificationCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */
  
  @IsOptional()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  year: number;

  @IsOptional()
  userCareerProfilId: string;

}
