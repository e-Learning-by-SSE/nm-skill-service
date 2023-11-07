/**
 * Creates a new CareerProfile
 * @author Christian Sauer <sauer@sse.uni-hildesheim.de>
 * 
 */

import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
export class CareerProfileCreationDto {
  
  /**
   * Used to validate that the user is the owner of the target repository.
   */

  currentCompanyId: string;
  professionalInterests: string;

  @IsDefined()
  userId: string;

}

