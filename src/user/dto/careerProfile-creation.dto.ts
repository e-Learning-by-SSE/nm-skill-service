import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new CareerProfile.
 */
export class CareerProfileCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */

  currentCompanyId: string;
  professionalInterests: string;

  @IsDefined()
  userId: string;

}

